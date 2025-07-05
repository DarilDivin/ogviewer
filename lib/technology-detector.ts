import { CheerioAPI } from 'cheerio';

export interface TechnologyDetection {
  frameworks: string[];
  cms: string[];
  analytics: string[];
  libraries: string[];
  cdn: string[];
  servers: string[];
  languages: string[];
  databases: string[];
  ecommerce: string[];
  marketing: string[];
}

export function detectTechnologies($: CheerioAPI, headers: any, html: string): TechnologyDetection {
  const technologies: TechnologyDetection = {
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

  // Analyse des headers HTTP
  analyzeHeaders(headers, technologies);
  
  // Analyse du HTML
  analyzeHTML($, technologies);
  
  // Analyse des scripts et liens
  analyzeScriptsAndLinks($, technologies);
  
  // Analyse des meta tags
  analyzeMetaTags($, technologies);
  
  // Analyse du contenu HTML
  analyzeContent(html, technologies);

  return technologies;
}

function analyzeHeaders(headers: any, technologies: TechnologyDetection) {
  const headerStr = JSON.stringify(headers).toLowerCase();
  
  // Serveurs web
  const server = headers.server?.toLowerCase();
  if (server) {
    if (server.includes('nginx')) technologies.servers.push('Nginx');
    if (server.includes('apache')) technologies.servers.push('Apache');
    if (server.includes('cloudflare')) technologies.servers.push('Cloudflare');
    if (server.includes('iis')) technologies.servers.push('IIS');
  }

  // Powered by
  const poweredBy = headers['x-powered-by']?.toLowerCase();
  if (poweredBy) {
    if (poweredBy.includes('php')) technologies.languages.push('PHP');
    if (poweredBy.includes('asp.net')) technologies.frameworks.push('ASP.NET');
    if (poweredBy.includes('express')) technologies.frameworks.push('Express.js');
  }

  // CDN
  if (headers['cf-ray']) technologies.cdn.push('Cloudflare');
  if (headers['x-served-by']) technologies.cdn.push('Fastly');
  if (headers['x-cache']) technologies.cdn.push('Varnish');
}

function analyzeHTML($: CheerioAPI, technologies: TechnologyDetection) {
  const htmlContent = $.html().toLowerCase();

  // React
  if (htmlContent.includes('react') || $('[data-reactroot]').length > 0 || 
      $('script').text().includes('React') || htmlContent.includes('__react')) {
    technologies.frameworks.push('React');
  }

  // Vue.js
  if (htmlContent.includes('vue') || $('[data-v-]').length > 0 || 
      $('script').text().includes('Vue') || htmlContent.includes('__vue')) {
    technologies.frameworks.push('Vue.js');
  }

  // Angular
  if (htmlContent.includes('angular') || $('[ng-]').length > 0 || 
      $('script').text().includes('Angular') || htmlContent.includes('__ng')) {
    technologies.frameworks.push('Angular');
  }

  // Next.js
  if (htmlContent.includes('next.js') || htmlContent.includes('__next') || 
      $('script[src*="_next"]').length > 0) {
    technologies.frameworks.push('Next.js');
  }

  // Nuxt.js
  if (htmlContent.includes('nuxt') || htmlContent.includes('__nuxt')) {
    technologies.frameworks.push('Nuxt.js');
  }

  // Svelte
  if (htmlContent.includes('svelte') || htmlContent.includes('__svelte')) {
    technologies.frameworks.push('Svelte');
  }
}

function analyzeScriptsAndLinks($: CheerioAPI, technologies: TechnologyDetection) {
  // Analyse des scripts
  $('script[src]').each((_, script) => {
    const src = $(script).attr('src')?.toLowerCase() || '';
    
    // Libraries JS populaires
    if (src.includes('jquery')) technologies.libraries.push('jQuery');
    if (src.includes('bootstrap')) technologies.libraries.push('Bootstrap');
    if (src.includes('lodash')) technologies.libraries.push('Lodash');
    if (src.includes('moment')) technologies.libraries.push('Moment.js');
    if (src.includes('gsap')) technologies.libraries.push('GSAP');
    if (src.includes('three')) technologies.libraries.push('Three.js');
    if (src.includes('d3')) technologies.libraries.push('D3.js');
    
    // Analytics
    if (src.includes('google-analytics') || src.includes('gtag') || src.includes('ga.js')) {
      technologies.analytics.push('Google Analytics');
    }
    if (src.includes('googletagmanager')) technologies.analytics.push('Google Tag Manager');
    if (src.includes('hotjar')) technologies.analytics.push('Hotjar');
    if (src.includes('mixpanel')) technologies.analytics.push('Mixpanel');
    if (src.includes('segment')) technologies.analytics.push('Segment');
    
    // CDN
    if (src.includes('cdnjs.cloudflare.com')) technologies.cdn.push('Cloudflare CDN');
    if (src.includes('jsdelivr.net')) technologies.cdn.push('jsDelivr');
    if (src.includes('unpkg.com')) technologies.cdn.push('unpkg');
    if (src.includes('googleapis.com')) technologies.cdn.push('Google APIs');
    
    // E-commerce
    if (src.includes('shopify')) technologies.ecommerce.push('Shopify');
    if (src.includes('stripe')) technologies.ecommerce.push('Stripe');
    if (src.includes('paypal')) technologies.ecommerce.push('PayPal');
    
    // Marketing
    if (src.includes('facebook.net') || src.includes('fbevents')) {
      technologies.marketing.push('Facebook Pixel');
    }
    if (src.includes('doubleclick')) technologies.marketing.push('DoubleClick');
    if (src.includes('adsystem.amazon')) technologies.marketing.push('Amazon Advertising');
  });

  // Analyse des liens CSS
  $('link[rel="stylesheet"]').each((_, link) => {
    const href = $(link).attr('href')?.toLowerCase() || '';
    
    if (href.includes('bootstrap')) technologies.libraries.push('Bootstrap');
    if (href.includes('tailwind')) technologies.libraries.push('Tailwind CSS');
    if (href.includes('bulma')) technologies.libraries.push('Bulma');
    if (href.includes('foundation')) technologies.libraries.push('Foundation');
    if (href.includes('semantic-ui')) technologies.libraries.push('Semantic UI');
    if (href.includes('materialize')) technologies.libraries.push('Materialize');
  });
}

function analyzeMetaTags($: CheerioAPI, technologies: TechnologyDetection) {
  // Generator meta tag
  const generator = $('meta[name="generator"]').attr('content');
  if (generator) {
    const gen = generator.toLowerCase();
    if (gen.includes('wordpress')) technologies.cms.push('WordPress');
    if (gen.includes('drupal')) technologies.cms.push('Drupal');
    if (gen.includes('joomla')) technologies.cms.push('Joomla');
    if (gen.includes('typo3')) technologies.cms.push('TYPO3');
    if (gen.includes('magento')) technologies.ecommerce.push('Magento');
    if (gen.includes('shopify')) technologies.ecommerce.push('Shopify');
    if (gen.includes('wix')) technologies.cms.push('Wix');
    if (gen.includes('squarespace')) technologies.cms.push('Squarespace');
    if (gen.includes('webflow')) technologies.cms.push('Webflow');
    if (gen.includes('hugo')) technologies.frameworks.push('Hugo');
    if (gen.includes('jekyll')) technologies.frameworks.push('Jekyll');
    if (gen.includes('gatsby')) technologies.frameworks.push('Gatsby');
  }

  // Autres meta tags
  $('meta').each((_, meta) => {
    const name = $(meta).attr('name')?.toLowerCase();
    const property = $(meta).attr('property')?.toLowerCase();
    const content = $(meta).attr('content')?.toLowerCase();
    
    if (content) {
      if (name === 'framework' || property === 'framework') {
        technologies.frameworks.push(content);
      }
    }
  });
}

function analyzeContent(html: string, technologies: TechnologyDetection) {
  const content = html.toLowerCase();
  
  // CMS patterns
  if (content.includes('wp-content') || content.includes('wp-includes')) {
    technologies.cms.push('WordPress');
  }
  if (content.includes('/sites/default/files') || content.includes('drupal')) {
    technologies.cms.push('Drupal');
  }
  if (content.includes('joomla')) {
    technologies.cms.push('Joomla');
  }
  
  // Framework patterns
  if (content.includes('data-turbo') || content.includes('turbo-frame')) {
    technologies.frameworks.push('Turbo (Hotwire)');
  }
  if (content.includes('alpine') && content.includes('x-data')) {
    technologies.frameworks.push('Alpine.js');
  }
  if (content.includes('htmx')) {
    technologies.frameworks.push('HTMX');
  }
  
  // Language patterns
  if (content.includes('<?php') || content.includes('.php')) {
    technologies.languages.push('PHP');
  }
  if (content.includes('__pycache__') || content.includes('.py')) {
    technologies.languages.push('Python');
  }
  if (content.includes('.aspx') || content.includes('__dopostback')) {
    technologies.languages.push('ASP.NET');
  }
  if (content.includes('.jsp') || content.includes('jsessionid')) {
    technologies.languages.push('Java');
  }

  // Remove duplicates
  Object.keys(technologies).forEach(key => {
    technologies[key as keyof TechnologyDetection] = [...new Set(technologies[key as keyof TechnologyDetection])];
  });
}
