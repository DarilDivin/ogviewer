import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';
import validator from 'validator';
import { analyzeSEO } from '@/lib/seo-analyzer';
import { detectTechnologies, convertToLegacyFormat } from '@/lib/technology-detector';
import { analyzePerformanceWithPageSpeed } from '@/lib/performance-analyzer';

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
        result.performance = await analyzePerformanceWithPageSpeed(url);
      } catch (error) {
        console.error('PageSpeed Insights performance analysis failed:', error);
        result.performance = { error: 'Performance analysis failed. Please try again.' };
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
    // First, try to get screenshot from PageSpeed Insights
    const { analyzePerformanceWithPageSpeed, extractScreenshotFromPageSpeed } = await import('@/lib/performance-analyzer');
    
    const performanceResult = await analyzePerformanceWithPageSpeed(url);
    
    // If we got PageSpeed data, try to extract screenshot
    if (performanceResult && !('error' in performanceResult)) {
      // Make another PageSpeed call specifically to get screenshot data
      const API_KEY = process.env.PAGESPEED_API_KEY;
      if (API_KEY) {
        try {
          const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=desktop&category=performance`;
          const response = await fetch(apiUrl);
          
          if (response.ok) {
            const data = await response.json();
            const screenshot = extractScreenshotFromPageSpeed(data.lighthouseResult);
            
            if (screenshot) {
              // Convert data URL to buffer and return
              const base64Data = screenshot.split(',')[1];
              const imageBuffer = Buffer.from(base64Data, 'base64');
              
              return new NextResponse(imageBuffer, {
                headers: {
                  'Content-Type': 'image/jpeg',
                  'Cache-Control': 'public, max-age=86400', // Cache for 1 day
                },
              });
            }
          }
        } catch (pageSpeedError) {
          console.warn('PageSpeed screenshot extraction failed:', pageSpeedError);
        }
      }
    }

    // Fallback to external screenshot API if PageSpeed doesn't work
    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
    
    if (isServerless && process.env.SCREENSHOT_API_KEY) {
      // Use ScreenshotOne as fallback
      const screenshotApiUrl = `https://api.screenshotone.com/take?access_key=${process.env.SCREENSHOT_API_KEY}&url=${encodeURIComponent(url)}&viewport_width=1280&viewport_height=720&device_scale_factor=1&format=png&response_type=json&store=true`;
      
      const response = await axios.get(screenshotApiUrl, { timeout: 30000 });
      
      if (response.data && response.data.store_url) {
        // Redirect to the stored screenshot
        return NextResponse.redirect(response.data.store_url);
      } else {
        throw new Error('Screenshot API failed to generate image');
      }
    } else {
      // For local development without API key, return a placeholder image
      const placeholderSvg = `
        <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f3f4f6"/>
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="24" fill="#6b7280">
            Screenshot not available
          </text>
          <text x="50%" y="60%" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af">
            PageSpeed Insights screenshot unavailable
          </text>
        </svg>
      `;

      return new NextResponse(placeholderSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
        },
      });
    }
  } catch (error) {
    console.error('Error capturing screenshot:', (error as Error).message);
    return NextResponse.json({ error: 'Failed to capture screenshot' }, { status: 500 });
  }
}
