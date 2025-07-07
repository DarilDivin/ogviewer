import axios from 'axios';
import { load } from 'cheerio';

// Types for technology detection
export interface Technology {
  name: string;
  confidence: number;
  icon?: string;
  website?: string;
  categories: string[];
  version?: string;
  // Nouvelles propriétés pour le debugging
  matchedPatterns?: string[];
  detectionMethod?: string;
}

export interface TechnologyDetectionResult {
  technologies: Technology[];
  categorized: {
    [category: string]: Technology[];
  };
  // Nouvelles propriétés pour les statistiques
  stats?: {
    totalPatternsChecked: number;
    detectionTime: number;
    htmlSize: number;
  };
}

export interface LegacyTechnologies {
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

// Improved detection patterns with exclusion rules
interface DetectionPattern {
  name: string;
  patterns: (RegExp | string)[];
  confidence: number;
  categories: string[];
  version?: RegExp;
  exclude?: RegExp[];
  requiresAll?: boolean; // Si true, tous les patterns doivent matcher
}

const detectionPatterns: DetectionPattern[] = [
  // JavaScript Frameworks (mutuellement exclusifs avec vérifications strictes)
  {
    name: 'Next.js',
    patterns: [
      /_next\//,
      /__NEXT_DATA__/,
      /_next\/static/,
      /next\/router/,
      /next\/image/
    ],
    confidence: 95,
    categories: ['Web frameworks'],
    exclude: [/angular\.js/i, /vue\.js/i, /@angular\//],
    requiresAll: false
  },
  {
    name: 'React',
    patterns: [
      /react\.development\.js/,
      /react\.production\.min\.js/,
      /react-dom/,
      /ReactDOM\.render/,
      /React\.createElement/
    ],
    confidence: 90,
    categories: ['JavaScript libraries'],
    exclude: [/angular/i, /vue\.js/i, /_next\//], // Exclure si Next.js détecté (qui inclut React)
    requiresAll: false
  },
  {
    name: 'Angular',
    patterns: [
      /@angular\/core/,
      /ng-version/,
      /angular\.min\.js/,
      /<ng-/,
      /ngOnInit/,
      /angular\.module/,
      /"ng"/,
      /AngularJS/i,
      /angular\.io/,
      /angular\/platform-browser/,
      /ng\.probe/
    ],
    confidence: 95,
    categories: ['Web frameworks'],
    exclude: [/react/i, /vue\.js/i, /_next\//],
    requiresAll: false
  },
  {
    name: 'Vue.js',
    patterns: [
      /vue\.js/,
      /vue\.min\.js/,
      /__VUE__/,
      /Vue\.component/,
      /new Vue\(/,
      /v-if=/,
      /v-for=/
    ],
    confidence: 90,
    categories: ['Web frameworks'],
    exclude: [/angular/i, /react/i, /_next\//],
    requiresAll: false
  },
  {
    name: 'Svelte',
    patterns: [
      /svelte/i,
      /svelte\.js/,
      /_svelte/
    ],
    confidence: 95,
    categories: ['Web frameworks'],
    exclude: [/angular/i, /react/i, /vue\.js/i, /_next\//]
  },

  // CSS Frameworks
  {
    name: 'Tailwind CSS',
    patterns: [
      /tailwindcss/i,
      /tailwind\.css/,
      /class="[^"]*(?:bg-|text-|p-|m-|flex|grid|w-|h-)/,
      /tw-/
    ],
    confidence: 85,
    categories: ['CSS frameworks']
  },
  {
    name: 'Bootstrap',
    patterns: [
      /bootstrap/i,
      /bootstrap\.css/,
      /btn btn-/,
      /container-fluid/,
      /class="[^"]*(?:col-|row|btn-|card|navbar)/
    ],
    confidence: 80,
    categories: ['CSS frameworks']
  },
  {
    name: 'Bulma',
    patterns: [
      /bulma/i,
      /bulma\.css/,
      /class="[^"]*(?:columns|column|button|notification)/
    ],
    confidence: 80,
    categories: ['CSS frameworks']
  },

  // Build Tools & Bundlers
  {
    name: 'Webpack',
    patterns: [
      /webpackJsonp/,
      /webpack_require/,
      /__webpack_/
    ],
    confidence: 90,
    categories: ['Development tools']
  },
  {
    name: 'Vite',
    patterns: [
      /@vite\//,
      /vite\.js/,
      /__vite__/
    ],
    confidence: 90,
    categories: ['Development tools']
  },

  // Analytics & Tracking
  {
    name: 'Google Analytics',
    patterns: [
      /google-analytics\.com/,
      /gtag\(/,
      /ga\(/,
      /UA-\d+-\d+/,
      /G-[A-Z0-9]+/
    ],
    confidence: 95,
    categories: ['Analytics']
  },
  {
    name: 'Google Tag Manager',
    patterns: [
      /googletagmanager\.com/,
      /GTM-[A-Z0-9]+/,
      /gtm\.js/,
      /_gtm/
    ],
    confidence: 95,
    categories: ['Analytics'
    ]
  },
  {
    name: 'Facebook Pixel',
    patterns: [
      /fbevents\.js/,
      /facebook\.net\/tr/,
      /fbq\(/
    ],
    confidence: 95,
    categories: ['Analytics']
  },

  // CDNs
  {
    name: 'Cloudflare',
    patterns: [
      /cloudflare/i,
      /cf-ray/i,
      /cdnjs\.cloudflare\.com/,
      /__cf_bm/
    ],
    confidence: 90,
    categories: ['CDN']
  },
  {
    name: 'jsDelivr',
    patterns: [
      /jsdelivr\.net/,
      /cdn\.jsdelivr\.net/
    ],
    confidence: 95,
    categories: ['CDN']
  },
  {
    name: 'unpkg',
    patterns: [
      /unpkg\.com/
    ],
    confidence: 95,
    categories: ['CDN']
  },

  // JavaScript Libraries
  {
    name: 'jQuery',
    patterns: [
      /jquery/i,
      /jquery\.js/,
      /\$\.fn\.jquery/,
      /jQuery/
    ],
    confidence: 85,
    categories: ['JavaScript libraries']
  },
  {
    name: 'Lodash',
    patterns: [
      /lodash/i,
      /lodash\.js/,
      /_\.VERSION/,
      /_\.map/
    ],
    confidence: 80,
    categories: ['JavaScript libraries']
  },
  {
    name: 'Axios',
    patterns: [
      /axios/i,
      /axios\.js/,
      /axios\.min\.js/
    ],
    confidence: 85,
    categories: ['JavaScript libraries']
  },
  {
    name: 'Three.js',
    patterns: [
      /three\.js/,
      /three\.min\.js/,
      /THREE\./
    ],
    confidence: 90,
    categories: ['JavaScript libraries']
  },

  // Animation Libraries
  {
    name: 'Framer Motion',
    patterns: [
      /framer-motion/,
      /motion\//,
      /animate\(/
    ],
    confidence: 85,
    categories: ['JavaScript libraries']
  },
  {
    name: 'GSAP',
    patterns: [
      /gsap/i,
      /TweenMax/,
      /TimelineMax/
    ],
    confidence: 90,
    categories: ['JavaScript libraries']
  },

  // UI Component Libraries
  {
    name: 'Material-UI',
    patterns: [
      /@mui\//,
      /material-ui/,
      /makeStyles/
    ],
    confidence: 85,
    categories: ['UI frameworks']
  },
  {
    name: 'Ant Design',
    patterns: [
      /antd/,
      /ant-design/,
      /\.ant-/
    ],
    confidence: 85,
    categories: ['UI frameworks']
  },
  {
    name: 'Chakra UI',
    patterns: [
      /@chakra-ui/,
      /chakra-ui/
    ],
    confidence: 90,
    categories: ['UI frameworks']
  },

  // CMS
  {
    name: 'WordPress',
    patterns: [
      /wp-content/,
      /wp-includes/,
      /wordpress/i,
      /wp-json/,
      /wp-admin/
    ],
    confidence: 95,
    categories: ['CMS']
  },
  {
    name: 'Drupal',
    patterns: [
      /drupal/i,
      /sites\/default\/files/,
      /misc\/drupal/
    ],
    confidence: 95,
    categories: ['CMS']
  },
  {
    name: 'Joomla',
    patterns: [
      /joomla/i,
      /components\/com_/,
      /modules\/mod_/
    ],
    confidence: 95,
    categories: ['CMS']
  },

  // E-commerce
  {
    name: 'Shopify',
    patterns: [
      /shopify/i,
      /cdn\.shopify\.com/,
      /myshopify\.com/,
      /Shopify\.shop/
    ],
    confidence: 95,
    categories: ['Ecommerce']
  },
  {
    name: 'WooCommerce',
    patterns: [
      /woocommerce/i,
      /wc-/,
      /wp-content\/plugins\/woocommerce/
    ],
    confidence: 95,
    categories: ['Ecommerce']
  },

  // Hosting & PaaS
  {
    name: 'Vercel',
    patterns: [
      /vercel/i,
      /x-vercel/i,
      /\.vercel\.app/,
      /__vercel/
    ],
    confidence: 90,
    categories: ['PaaS']
  },
  {
    name: 'Netlify',
    patterns: [
      /netlify/i,
      /\.netlify\.app/,
      /x-nf-/i,
      /__netlify/
    ],
    confidence: 90,
    categories: ['PaaS']
  },
  {
    name: 'GitHub Pages',
    patterns: [
      /\.github\.io/,
      /github\.com/
    ],
    confidence: 80,
    categories: ['PaaS']
  },

  // Security & Performance
  {
    name: 'reCAPTCHA',
    patterns: [
      /recaptcha/i,
      /google\.com\/recaptcha/,
      /g-recaptcha/
    ],
    confidence: 95,
    categories: ['Security']
  },
  {
    name: 'Hotjar',
    patterns: [
      /hotjar/i,
      /static\.hotjar\.com/,
      /hjid/
    ],
    confidence: 95,
    categories: ['Analytics']
  }
];

// Mapping from Wappalyzer categories to our legacy format
const categoryMapping: { [key: string]: keyof LegacyTechnologies } = {
  'Web frameworks': 'frameworks',
  'JavaScript frameworks': 'frameworks',
  'JavaScript libraries': 'libraries',
  'CMS': 'cms',
  'Analytics': 'analytics',
  'CDN': 'cdn',
  'Web servers': 'servers',
  'PaaS': 'servers',
  'Programming languages': 'languages',
  'Databases': 'databases',
  'Ecommerce': 'ecommerce',
  'Marketing automation': 'marketing'
};

/**
 * Détecte les technologies en utilisant des patterns personnalisés avec logique anti-faux-positifs
 */
async function detectWithPatterns(url: string, html: string): Promise<Technology[]> {
  const detected: Technology[] = [];
  const excludedPatterns = new Set<string>();
  
  // Premier passage : détecter les frameworks principaux et les exclusions
  const frameworkPatterns = detectionPatterns.filter(p => 
    p.categories.includes('Web frameworks') || 
    p.categories.includes('JavaScript frameworks')
  );
  
  const detectedFrameworks: string[] = [];
  
  for (const pattern of frameworkPatterns) {
    let matches = 0;
    const totalPatterns = pattern.patterns.length;
    
    for (const p of pattern.patterns) {
      if (typeof p === 'string') {
        if (html.toLowerCase().includes(p.toLowerCase())) matches++;
      } else {
        if (p.test(html)) matches++;
      }
    }

    const matchRatio = matches / totalPatterns;
    const threshold = pattern.requiresAll ? 1.0 : 0.2; // Seuil plus bas pour les frameworks

    if (matchRatio >= threshold) {
      // Vérifier les exclusions
      let excluded = false;
      if (pattern.exclude) {
        for (const excludePattern of pattern.exclude) {
          if (excludePattern.test(html)) {
            excluded = true;
            console.log(`${pattern.name} exclu à cause de ${excludePattern}`);
            break;
          }
        }
      }

      if (!excluded) {
        detectedFrameworks.push(pattern.name);
        
        // Extraire la version si possible
        let version: string | undefined;
        if (pattern.version) {
          const versionMatch = html.match(pattern.version);
          if (versionMatch) {
            version = versionMatch[1];
          }
        }

        detected.push({
          name: pattern.name,
          confidence: Math.min(pattern.confidence * matchRatio * 1.2, 100), // Bonus pour les frameworks
          categories: pattern.categories,
          version
        });
      }
    }
  }

  // Logique spéciale : si Next.js est détecté, ne pas détecter React séparément
  if (detectedFrameworks.includes('Next.js')) {
    excludedPatterns.add('React');
  }
  
  // Si Angular est détecté, exclure tous les autres frameworks
  if (detectedFrameworks.includes('Angular')) {
    excludedPatterns.add('React');
    excludedPatterns.add('Vue.js');
    excludedPatterns.add('Next.js');
  }

  // Deuxième passage : détecter les autres technologies
  const otherPatterns = detectionPatterns.filter(p => 
    !p.categories.includes('Web frameworks') && 
    !p.categories.includes('JavaScript frameworks')
  );

  for (const pattern of otherPatterns) {
    if (excludedPatterns.has(pattern.name)) continue;

    let matches = 0;
    const totalPatterns = pattern.patterns.length;
    
    for (const p of pattern.patterns) {
      if (typeof p === 'string') {
        if (html.toLowerCase().includes(p.toLowerCase())) matches++;
      } else {
        if (p.test(html)) matches++;
      }
    }

    const matchRatio = matches / totalPatterns;
    const threshold = pattern.requiresAll ? 1.0 : 0.3;

    if (matchRatio >= threshold) {
      // Vérifier les exclusions
      let excluded = false;
      if (pattern.exclude) {
        for (const excludePattern of pattern.exclude) {
          if (excludePattern.test(html)) {
            excluded = true;
            break;
          }
        }
      }

      if (!excluded) {
        // Extraire la version si possible
        let version: string | undefined;
        if (pattern.version) {
          const versionMatch = html.match(pattern.version);
          if (versionMatch) {
            version = versionMatch[1];
          }
        }

        detected.push({
          name: pattern.name,
          confidence: Math.min(pattern.confidence * matchRatio, 100),
          categories: pattern.categories,
          version
        });
      }
    }
  }

  // Ajuster les scores de confiance en fonction du contexte
  return detected.map(tech => {
    // Bonus pour les technologies cohérentes
    if (tech.name === 'Tailwind CSS' && detectedFrameworks.includes('Next.js')) {
      tech.confidence = Math.min(tech.confidence + 10, 100);
    }
    
    if (tech.name === 'Vercel' && detectedFrameworks.includes('Next.js')) {
      tech.confidence = Math.min(tech.confidence + 15, 100);
    }

    return tech;
  });
}

/**
 * Utilise une API Wappalyzer externe pour détecter les technologies
 */
async function detectWithExternalWappalyzer(url: string): Promise<Technology[]> {
  try {
    // Utiliser l'API Wappalyzer publique (si disponible) ou notre détection avancée
    // Pour l'instant, on utilisera notre détection custom qui est plus fiable
    return [];
  } catch (error) {
    console.warn('External Wappalyzer detection failed:', error);
    return [];
  }
}

/**
 * Analyse les en-têtes HTTP pour détecter des technologies
 */
function detectFromHeaders(headers: any): Technology[] {
  const detected: Technology[] = [];

  // Server header
  const server = headers['server'];
  if (server) {
    if (server.toLowerCase().includes('nginx')) {
      detected.push({
        name: 'Nginx',
        confidence: 95,
        categories: ['Web servers']
      });
    } else if (server.toLowerCase().includes('apache')) {
      detected.push({
        name: 'Apache',
        confidence: 95,
        categories: ['Web servers']
      });
    }
  }

  // X-Powered-By header
  const poweredBy = headers['x-powered-by'];
  if (poweredBy) {
    if (poweredBy.toLowerCase().includes('express')) {
      detected.push({
        name: 'Express',
        confidence: 90,
        categories: ['Web frameworks']
      });
    } else if (poweredBy.toLowerCase().includes('php')) {
      detected.push({
        name: 'PHP',
        confidence: 90,
        categories: ['Programming languages']
      });
    }
  }

  return detected;
}

/**
 * Fonction principale de détection de technologies
 */
export async function detectTechnologies(url: string): Promise<TechnologyDetectionResult> {
  const startTime = Date.now();
  
  try {
    // Récupérer le HTML et les en-têtes
    const response = await axios.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const html = response.data;

    // Détecter avec notre système avancé
    const externalResults = await detectWithExternalWappalyzer(url);
    
    // Détecter avec nos patterns personnalisés
    const patternResults = await detectWithPatterns(url, html);
    
    // Détecter depuis les en-têtes
    const headerResults = detectFromHeaders(response.headers);

    // Fusionner et dédupliquer les résultats
    const allResults = [...externalResults, ...patternResults, ...headerResults];
    const uniqueResults = new Map<string, Technology>();

    for (const tech of allResults) {
      const existing = uniqueResults.get(tech.name);
      if (!existing || tech.confidence > existing.confidence) {
        uniqueResults.set(tech.name, {
          ...tech,
          detectionMethod: existing ? 'merged' : (tech.detectionMethod || 'pattern')
        });
      }
    }

    const technologies = Array.from(uniqueResults.values())
      .sort((a, b) => b.confidence - a.confidence);

    // Catégoriser les résultats
    const categorized: { [category: string]: Technology[] } = {};
    for (const tech of technologies) {
      for (const category of tech.categories) {
        if (!categorized[category]) {
          categorized[category] = [];
        }
        categorized[category].push(tech);
      }
    }

    const detectionTime = Date.now() - startTime;

    return {
      technologies,
      categorized,
      stats: {
        totalPatternsChecked: detectionPatterns.length,
        detectionTime,
        htmlSize: html.length
      }
    };
  } catch (error) {
    console.error('Technology detection failed:', error);
    return {
      technologies: [],
      categorized: {},
      stats: {
        totalPatternsChecked: 0,
        detectionTime: Date.now() - startTime,
        htmlSize: 0
      }
    };
  }
}

/**
 * Convertit les résultats détaillés vers le format legacy
 */
export function convertToLegacyFormat(result: TechnologyDetectionResult): LegacyTechnologies {
  const legacy: LegacyTechnologies = {
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

  for (const tech of result.technologies) {
    for (const category of tech.categories) {
      const legacyCategory = categoryMapping[category];
      if (legacyCategory && !legacy[legacyCategory].includes(tech.name)) {
        legacy[legacyCategory].push(tech.name);
      }
    }
  }

  return legacy;
}
