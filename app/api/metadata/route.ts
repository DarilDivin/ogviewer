import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';
import validator from 'validator';
import puppeteer from 'puppeteer';
import { analyzeSEO } from '@/lib/seo-analyzer';
import { detectTechnologies, convertToLegacyFormat } from '@/lib/technology-detector';
import { analyzePerformance } from '@/lib/performance-analyzer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const analysis = searchParams.get('analysis') || 'basic'; // basic, seo, tech, performance, full

  if (!url || !validator.isURL(url, { require_protocol: true })) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Block internal addresses for security
  const blockedHosts = ['localhost', '127.0.0.1'];
  const hostname = new URL(url).hostname;
  if (blockedHosts.includes(hostname)) {
    return NextResponse.json({ error: 'Access to internal addresses is not allowed' }, { status: 403 });
  }

  try {
    const response = await axios.get(url, { timeout: 10000 });
    const html = response.data;
    const $ = load(html);

    // Basic metadata
    const title = $('title').text() || null;
    const description = $('meta[name="description"]').attr('content') || null;
    const image = $('meta[property="og:image"]').attr('content') || null;
    const canonical = $('link[rel="canonical"]').attr('href') || url;
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href') || null;

    const result: any = {
      title,
      description,
      image,
      url: canonical,
      favicon: favicon ? new URL(favicon, url).href : null,
    };

    // Run analyses based on request type
    if (analysis === 'seo' || analysis === 'full') {
      result.seo = analyzeSEO($, html);
    }

    if (analysis === 'tech' || analysis === 'full') {
      try {
        // Utiliser notre détecteur local amélioré
        const techResult = await detectTechnologies(url);
        
        // Convertir vers l'ancien format pour compatibilité
        result.technologies = convertToLegacyFormat(techResult);
        
        // Ajouter aussi le nouveau format complet
        result.technologiesDetailed = techResult;
      } catch (error) {
        console.error('Technology detection failed:', error);
        result.technologies = {
          frameworks: [],
          cms: [],
          analytics: [],
          libraries: [],
          cdn: [],
          servers: [],
          languages: [],
          databases: [],
          ecommerce: [],
          marketing: [],
        };
        result.technologiesDetailed = {
          technologies: [],
          categorized: {},
          stats: {
            totalPatternsChecked: 0,
            detectionTime: 0,
            htmlSize: 0
          }
        };
      }
    }

    if (analysis === 'performance' || analysis === 'full') {
      try {
        result.performance = await analyzePerformance(url);
      } catch (error) {
        console.error('Lighthouse performance analysis failed:', error);
        result.performance = { error: 'Lighthouse analysis failed. Please try again.' };
      }
    }

    // Legacy technology detection for backward compatibility
    if (analysis === 'basic') {
      const technologies: string[] = [];

      // Check HTTP headers for technology hints
      const poweredBy = response.headers['x-powered-by'];
      if (poweredBy) {
        technologies.push(`Powered by: ${poweredBy}`);
      }

      // Check meta tags for technology hints
      $('meta').each((_, element) => {
        const name = $(element).attr('name')?.toLowerCase();
        const content = $(element).attr('content');

        if (name && content) {
          if (name.includes('generator')) {
            technologies.push(`Generator: ${content}`);
          } else if (name.includes('framework')) {
            technologies.push(`Framework: ${content}`);
          }
        }
      });

      // Convert to new format for consistency
      if (technologies.length > 0) {
        result.technologies = {
          frameworks: [],
          cms: [],
          analytics: [],
          libraries: [],
          cdn: [],
          servers: technologies.filter(tech => tech.startsWith('Powered by:')),
          languages: [],
          databases: [],
          ecommerce: [],
          marketing: technologies.filter(tech => tech.startsWith('Generator:') || tech.startsWith('Framework:'))
        };
      } else {
        result.technologies = {
          frameworks: [],
          cms: [],
          analytics: [],
          libraries: [],
          cdn: [],
          servers: [],
          languages: [],
          databases: [],
          ecommerce: [],
          marketing: []
        };
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching metadata:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url || !validator.isURL(url, { require_protocol: true })) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ type: 'png' });
    await browser.close();

    return new NextResponse(screenshot, {
      headers: {
        'Content-Type': 'image/png',
      },
    });
  } catch (error) {
    console.error('Error capturing screenshot:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}
