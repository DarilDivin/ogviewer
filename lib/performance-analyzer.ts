import puppeteer from 'puppeteer';

export interface PerformanceMetrics {
  score: number;
  metrics: {
    firstContentfulPaint: number;
    largestContentfulPaint: number;
    firstInputDelay: number;
    cumulativeLayoutShift: number;
    speedIndex: number;
    timeToInteractive: number;
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
    numericValue: number;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    score: number;
  }>;
  loadingTime: number;
  resourceSizes: {
    html: number;
    css: number;
    javascript: number;
    images: number;
    fonts: number;
    other: number;
    total: number;
  };
}

export async function analyzePerformance(url: string): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    // Navigate and measure timing
    const navigationStartTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const navigationEndTime = Date.now();
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paintEntries = performance.getEntriesByType('paint');
      
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        loadComplete: navigation.loadEventEnd - navigation.fetchStart,
        firstPaint: paintEntries.find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: paintEntries.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        ttfb: navigation.responseStart - navigation.fetchStart,
        domInteractive: navigation.domInteractive - navigation.fetchStart,
      };
    });

    // Get resource information
    const resourceInfo = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const sizes = {
        html: 0,
        css: 0,
        javascript: 0,
        images: 0,
        fonts: 0,
        other: 0,
        total: 0
      };

      resources.forEach(resource => {
        const size = resource.transferSize || 0;
        const name = resource.name.toLowerCase();
        
        if (name.includes('.css')) {
          sizes.css += size;
        } else if (name.includes('.js')) {
          sizes.javascript += size;
        } else if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)/)) {
          sizes.images += size;
        } else if (name.match(/\.(woff|woff2|ttf|otf)/)) {
          sizes.fonts += size;
        } else if (resource.initiatorType === 'navigation') {
          sizes.html += size;
        } else {
          sizes.other += size;
        }
        sizes.total += size;
      });

      return sizes;
    });

    const loadingTime = Date.now() - startTime;
    const navigationTime = navigationEndTime - navigationStartTime;

    // Calculate a simplified performance score
    let score = 100;
    
    // Penalize slow loading times
    if (performanceMetrics.firstContentfulPaint > 3000) score -= 30;
    else if (performanceMetrics.firstContentfulPaint > 1800) score -= 15;
    
    if (performanceMetrics.loadComplete > 5000) score -= 25;
    else if (performanceMetrics.loadComplete > 3000) score -= 10;
    
    if (resourceInfo.total > 5 * 1024 * 1024) score -= 20; // > 5MB
    else if (resourceInfo.total > 2 * 1024 * 1024) score -= 10; // > 2MB
    
    if (performanceMetrics.ttfb > 1000) score -= 15;
    else if (performanceMetrics.ttfb > 500) score -= 8;

    score = Math.max(0, Math.min(100, score));

    // Generate basic opportunities and diagnostics
    const opportunities = [];
    const diagnostics = [];

    if (performanceMetrics.firstContentfulPaint > 2500) {
      opportunities.push({
        id: 'fcp-improvement',
        title: 'Améliorer le First Contentful Paint',
        description: 'Le premier contenu prend trop de temps à s\'afficher',
        score: 0.5,
        numericValue: performanceMetrics.firstContentfulPaint - 1800
      });
    }

    if (resourceInfo.total > 2 * 1024 * 1024) {
      opportunities.push({
        id: 'reduce-resource-size',
        title: 'Réduire la taille des ressources',
        description: 'Les ressources sont trop volumineuses',
        score: 0.3,
        numericValue: resourceInfo.total - (1024 * 1024)
      });
    }

    if (performanceMetrics.ttfb > 800) {
      diagnostics.push({
        id: 'slow-server',
        title: 'Temps de réponse serveur lent',
        description: 'Le serveur met trop de temps à répondre',
        score: 0.4
      });
    }

    const result: PerformanceMetrics = {
      score: Math.round(score),
      metrics: {
        firstContentfulPaint: performanceMetrics.firstContentfulPaint,
        largestContentfulPaint: performanceMetrics.firstContentfulPaint * 1.2, // Approximation
        firstInputDelay: 50, // Estimation conservative
        cumulativeLayoutShift: 0.1, // Estimation
        speedIndex: performanceMetrics.domContentLoaded,
        timeToInteractive: performanceMetrics.domInteractive,
      },
      opportunities,
      diagnostics,
      loadingTime: navigationTime,
      resourceSizes: resourceInfo,
    };

    return result;
  } finally {
    await browser.close();
  }
}

export function getPerformanceGrade(score: number): { grade: string; color: string; description: string } {
  if (score >= 90) {
    return {
      grade: 'A',
      color: 'green',
      description: 'Excellente performance'
    };
  } else if (score >= 75) {
    return {
      grade: 'B',
      color: 'yellow',
      description: 'Bonne performance'
    };
  } else if (score >= 50) {
    return {
      grade: 'C',
      color: 'orange',
      description: 'Performance moyenne'
    };
  } else {
    return {
      grade: 'D',
      color: 'red',
      description: 'Performance à améliorer'
    };
  }
}

export function formatMetricValue(value: number, unit: 'ms' | 'score' | 'bytes'): string {
  switch (unit) {
    case 'ms':
      if (value < 1000) {
        return `${Math.round(value)}ms`;
      } else {
        return `${(value / 1000).toFixed(1)}s`;
      }
    case 'score':
      return (value * 100).toFixed(1);
    case 'bytes':
      if (value < 1024) {
        return `${value}B`;
      } else if (value < 1024 * 1024) {
        return `${(value / 1024).toFixed(1)}KB`;
      } else {
        return `${(value / (1024 * 1024)).toFixed(1)}MB`;
      }
    default:
      return value.toString();
  }
}
