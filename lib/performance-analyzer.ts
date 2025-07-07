import lighthouse from 'lighthouse';
import puppeteer from 'puppeteer';

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
  opportunities: LighthouseOpportunity[];
  diagnostics: LighthouseDiagnostic[];
}

export interface LighthouseOpportunity {
  id: string;
  title: string;
  description: string;
  score: number;
  numericValue: number;
  displayValue: string;
  details?: any;
}

export interface LighthouseDiagnostic {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue: string;
  details?: any;
}

export async function analyzePerformance(url: string): Promise<PerformanceMetrics> {
  const startTime = Date.now();
  
  try {
    console.log(`🚀 Starting Lighthouse analysis for: ${url}`);
    
    // Configuration Lighthouse
    const lighthouseOptions = {
      logLevel: 'info' as const,
      output: 'json' as const,
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      port: undefined as number | undefined,
    };

    // Lancement de Puppeteer pour Lighthouse
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      // Obtenir le port WebSocket de Puppeteer
      const endpoint = browser.wsEndpoint();
      const port = new URL(endpoint).port;
      lighthouseOptions.port = parseInt(port) || 9222;

      // Exécution de Lighthouse
      const runnerResult = await lighthouse(url, lighthouseOptions);
      
      if (!runnerResult || !runnerResult.lhr) {
        throw new Error('Lighthouse analysis failed');
      }

      const lhr = runnerResult.lhr;
      const analysisTime = Date.now() - startTime;

      // Extraction des métriques Core Web Vitals
      const metrics = lhr.audits;
      
      const performanceMetrics: PerformanceMetrics = {
        // Core Web Vitals
        firstContentfulPaint: metrics['first-contentful-paint']?.numericValue || 0,
        largestContentfulPaint: metrics['largest-contentful-paint']?.numericValue || 0,
        cumulativeLayoutShift: metrics['cumulative-layout-shift']?.numericValue || 0,
        firstInputDelay: metrics['max-potential-fid']?.numericValue,
        interactionToNextPaint: metrics['interaction-to-next-paint']?.numericValue,
        
        // Additional metrics
        timeToInteractive: metrics['interactive']?.numericValue || 0,
        speedIndex: metrics['speed-index']?.numericValue || 0,
        totalBlockingTime: metrics['total-blocking-time']?.numericValue || 0,
        
        // Scores (0-100)
        performanceScore: Math.round((lhr.categories.performance?.score || 0) * 100),
        accessibilityScore: Math.round((lhr.categories.accessibility?.score || 0) * 100),
        bestPracticesScore: Math.round((lhr.categories['best-practices']?.score || 0) * 100),
        seoScore: Math.round((lhr.categories.seo?.score || 0) * 100),
        
        // Technical details
        analysisTime,
        url: lhr.finalUrl || url,
        userAgent: lhr.userAgent || 'Lighthouse/Unknown',
        
        // Opportunities and diagnostics
        opportunities: extractOpportunities(lhr),
        diagnostics: extractDiagnostics(lhr),
      };

      console.log(`✅ Lighthouse analysis completed in ${analysisTime}ms`);
      console.log(`📊 Performance Score: ${performanceMetrics.performanceScore}/100`);
      
      return performanceMetrics;
      
    } finally {
      await browser.close();
    }
    
  } catch (error) {
    console.error('❌ Lighthouse analysis failed:', error);
    throw new Error(`Lighthouse analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Extraction des opportunités d'amélioration
function extractOpportunities(lhr: any): LighthouseOpportunity[] {
  const opportunities: LighthouseOpportunity[] = [];
  
  const opportunityAudits = [
    'render-blocking-resources',
    'unused-css-rules',
    'unused-javascript',
    'modern-image-formats',
    'offscreen-images',
    'unminified-css',
    'unminified-javascript',
    'efficient-animated-content',
    'duplicated-javascript',
    'legacy-javascript',
  ];
  
  opportunityAudits.forEach(auditId => {
    const audit = lhr.audits[auditId];
    if (audit && audit.score !== null && audit.score < 1) {
      opportunities.push({
        id: auditId,
        title: audit.title,
        description: audit.description,
        score: Math.round((audit.score || 0) * 100),
        numericValue: audit.numericValue || 0,
        displayValue: audit.displayValue || '',
        details: audit.details,
      });
    }
  });
  
  return opportunities.sort((a, b) => b.numericValue - a.numericValue);
}

// Extraction des diagnostics
function extractDiagnostics(lhr: any): LighthouseDiagnostic[] {
  const diagnostics: LighthouseDiagnostic[] = [];
  
  const diagnosticAudits = [
    'mainthread-work-breakdown',
    'bootup-time',
    'uses-long-cache-ttl',
    'total-byte-weight',
    'dom-size',
    'critical-request-chains',
    'user-timings',
    'diagnostics',
  ];
  
  diagnosticAudits.forEach(auditId => {
    const audit = lhr.audits[auditId];
    if (audit) {
      diagnostics.push({
        id: auditId,
        title: audit.title,
        description: audit.description,
        score: Math.round((audit.score || 0) * 100),
        displayValue: audit.displayValue || '',
        details: audit.details,
      });
    }
  });
  return diagnostics;
}
