export interface PerformanceMetrics {
  // Core Web Vitals
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay?: number;
  interactionToNextPaint?: number;
  
  // Additional metrics
  timeToInteractive: number;
  speedIndex: number;
  totalBlockingTime: number;
  
  // Scores
  performanceScore: number;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  
  // Technical details
  analysisTime: number;
  url: string;
  userAgent: string;
  
  // Opportunities and diagnostics
  opportunities: PerformanceOpportunity[];
  diagnostics: PerformanceDiagnostic[];
}

export interface PerformanceOpportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  numericValue: number;
  displayValue: string;
  details?: any;
}

export interface PerformanceDiagnostic {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue: string;
  details?: any;
}
// Performance analysis using Google PageSpeed Insights API
export async function analyzePerformanceWithPageSpeed(url: string): Promise<PerformanceMetrics | { error: string }> {
  const API_KEY = process.env.PAGESPEED_API_KEY;
  
  if (!API_KEY) {
    return { error: 'Google PageSpeed Insights API key not configured' };
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&strategy=desktop&category=performance&category=accessibility&category=best-practices&category=seo`;

  try {
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`PageSpeed API error: ${response.status}`);
    }
    
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'PageSpeed API error');
    }

    const lighthouseResult = data.lighthouseResult;
    const audits = lighthouseResult.audits;
    const categories = lighthouseResult.categories;

    // Mapping exact des données Lighthouse
    return {
      // Scores (convertis de 0-1 à 0-100)
      performanceScore: Math.round((categories.performance?.score || 0) * 100),
      accessibilityScore: Math.round((categories.accessibility?.score || 0) * 100),
      bestPracticesScore: Math.round((categories['best-practices']?.score || 0) * 100),
      seoScore: Math.round((categories.seo?.score || 0) * 100),
      
      // Métriques Core Web Vitals et autres
      firstContentfulPaint: audits['first-contentful-paint']?.numericValue || 0,
      largestContentfulPaint: audits['largest-contentful-paint']?.numericValue || 0,
      totalBlockingTime: audits['total-blocking-time']?.numericValue || 0,
      cumulativeLayoutShift: audits['cumulative-layout-shift']?.numericValue || 0,
      speedIndex: audits['speed-index']?.numericValue || 0,
      timeToInteractive: audits['interactive']?.numericValue || 0,
      firstInputDelay: audits['max-potential-fid']?.numericValue,
      interactionToNextPaint: audits['interaction-to-next-paint']?.numericValue,
      
      // Informations techniques
      analysisTime: lighthouseResult.timing?.total || 0,
      url: lighthouseResult.finalUrl || url,
      userAgent: lighthouseResult.userAgent || 'Unknown',
      
      // Opportunités d'amélioration
      opportunities: Object.entries(audits)
        .filter(([_, audit]: [string, any]) => 
          audit.details?.type === 'opportunity' && 
          audit.numericValue > 0
        )
        .map(([id, audit]: [string, any]) => ({
          id,
          title: audit.title,
          description: audit.description,
          score: audit.score || 0,
          numericValue: audit.numericValue || 0,
          displayValue: audit.displayValue || '',
          details: audit.details
        }))
        .slice(0, 10), // Limiter à 10 opportunités      
      // Diagnostics
      diagnostics: Object.entries(audits)
        .filter(([_, audit]: [string, any]) => 
          audit.details?.type === 'diagnostic' && 
          audit.score !== null && 
          audit.score < 1
        )
        .map(([id, audit]: [string, any]) => ({
          id,
          title: audit.title,
          description: audit.description,
          score: audit.score || 0,
          displayValue: audit.displayValue || '',
          details: audit.details
        }))
        .slice(0, 10) // Limiter à 10 diagnostics
    };
  } catch (error) {
    console.error('PageSpeed Insights API error:', error);
    return { 
      error: `Failed to analyze performance: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

// Extract screenshot from PageSpeed Insights results
export function extractScreenshotFromPageSpeed(lighthouseResult: any): string | null {
  try {
    // Try to get the final screenshot (best quality)
    const finalScreenshot = lighthouseResult.audits?.['final-screenshot']?.details?.data;
    if (finalScreenshot && finalScreenshot.startsWith('data:image/')) {
      return finalScreenshot;
    }

    // Fallback to screenshot thumbnails (last one is usually the final state)
    const thumbnails = lighthouseResult.audits?.['screenshot-thumbnails']?.details?.items;
    if (thumbnails && thumbnails.length > 0) {
      const lastThumbnail = thumbnails[thumbnails.length - 1];
      if (lastThumbnail?.data && lastThumbnail.data.startsWith('data:image/')) {
        return lastThumbnail.data;
      }
    }

    return null;
  } catch (error) {
    console.error('Error extracting screenshot from PageSpeed:', error);
    return null;
  }
}
