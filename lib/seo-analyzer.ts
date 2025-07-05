import { CheerioAPI } from 'cheerio';

export interface SEOAnalysis {
  score: number;
  issues: string[];
  recommendations: string[];
  details: {
    title: {
      exists: boolean;
      length: number;
      optimal: boolean;
    };
    description: {
      exists: boolean;
      length: number;
      optimal: boolean;
    };
    headings: {
      h1Count: number;
      h2Count: number;
      h3Count: number;
      hasH1: boolean;
      multipleH1: boolean;
    };
    images: {
      total: number;
      withAlt: number;
      withoutAlt: number;
      altCoverage: number;
    };
    links: {
      internal: number;
      external: number;
      nofollow: number;
    };
  };
}

export function analyzeSEO($: CheerioAPI, html: string): SEOAnalysis {
  const analysis: SEOAnalysis = {
    score: 0,
    issues: [],
    recommendations: [],
    details: {
      title: {
        exists: false,
        length: 0,
        optimal: false,
      },
      description: {
        exists: false,
        length: 0,
        optimal: false,
      },
      headings: {
        h1Count: 0,
        h2Count: 0,
        h3Count: 0,
        hasH1: false,
        multipleH1: false,
      },
      images: {
        total: 0,
        withAlt: 0,
        withoutAlt: 0,
        altCoverage: 0,
      },
      links: {
        internal: 0,
        external: 0,
        nofollow: 0,
      },
    },
  };

  let score = 0;
  const maxScore = 100;

  // Analyse du titre
  const title = $('title').text();
  if (title) {
    analysis.details.title.exists = true;
    analysis.details.title.length = title.length;
    
    if (title.length >= 30 && title.length <= 60) {
      analysis.details.title.optimal = true;
      score += 15;
    } else {
      analysis.issues.push(`Titre trop ${title.length < 30 ? 'court' : 'long'} (${title.length} caractères)`);
      analysis.recommendations.push('Optimisez la longueur du titre entre 30-60 caractères');
      score += 5;
    }
  } else {
    analysis.issues.push('Titre manquant');
    analysis.recommendations.push('Ajoutez un titre unique et descriptif');
  }

  // Analyse de la description
  const description = $('meta[name="description"]').attr('content');
  if (description) {
    analysis.details.description.exists = true;
    analysis.details.description.length = description.length;
    
    if (description.length >= 120 && description.length <= 160) {
      analysis.details.description.optimal = true;
      score += 15;
    } else {
      analysis.issues.push(`Description trop ${description.length < 120 ? 'courte' : 'longue'} (${description.length} caractères)`);
      analysis.recommendations.push('Optimisez la longueur de la description entre 120-160 caractères');
      score += 5;
    }
  } else {
    analysis.issues.push('Meta description manquante');
    analysis.recommendations.push('Ajoutez une meta description unique');
  }

  // Analyse des titres (H1, H2, H3)
  const h1Elements = $('h1');
  const h2Elements = $('h2');
  const h3Elements = $('h3');
  
  analysis.details.headings.h1Count = h1Elements.length;
  analysis.details.headings.h2Count = h2Elements.length;
  analysis.details.headings.h3Count = h3Elements.length;
  analysis.details.headings.hasH1 = h1Elements.length > 0;
  analysis.details.headings.multipleH1 = h1Elements.length > 1;

  if (analysis.details.headings.hasH1) {
    score += 10;
    if (analysis.details.headings.multipleH1) {
      analysis.issues.push('Plusieurs balises H1 détectées');
      analysis.recommendations.push('Utilisez une seule balise H1 par page');
      score -= 5;
    }
  } else {
    analysis.issues.push('Aucune balise H1 trouvée');
    analysis.recommendations.push('Ajoutez une balise H1 unique et descriptive');
  }

  if (analysis.details.headings.h2Count > 0) {
    score += 10;
  } else {
    analysis.recommendations.push('Ajoutez des balises H2 pour structurer le contenu');
  }

  // Analyse des images
  const images = $('img');
  analysis.details.images.total = images.length;
  
  images.each((_, img) => {
    const alt = $(img).attr('alt');
    if (alt && alt.trim()) {
      analysis.details.images.withAlt++;
    } else {
      analysis.details.images.withoutAlt++;
    }
  });

  if (analysis.details.images.total > 0) {
    analysis.details.images.altCoverage = 
      (analysis.details.images.withAlt / analysis.details.images.total) * 100;
    
    if (analysis.details.images.altCoverage === 100) {
      score += 15;
    } else if (analysis.details.images.altCoverage >= 80) {
      score += 10;
      analysis.recommendations.push('Ajoutez des attributs alt aux images restantes');
    } else {
      analysis.issues.push(`${analysis.details.images.withoutAlt} images sans attribut alt`);
      analysis.recommendations.push('Ajoutez des attributs alt descriptifs à toutes les images');
      score += 5;
    }
  }

  // Analyse des liens
  const links = $('a[href]');
  links.each((_, link) => {
    const href = $(link).attr('href');
    const rel = $(link).attr('rel');
    
    if (href) {
      if (href.startsWith('http') || href.startsWith('//')) {
        analysis.details.links.external++;
      } else {
        analysis.details.links.internal++;
      }
      
      if (rel && rel.includes('nofollow')) {
        analysis.details.links.nofollow++;
      }
    }
  });

  if (analysis.details.links.internal > 0) {
    score += 10;
  } else {
    analysis.recommendations.push('Ajoutez des liens internes pour améliorer la navigation');
  }

  // Vérifications additionnelles
  const hasRobotsMeta = $('meta[name="robots"]').length > 0;
  if (hasRobotsMeta) {
    score += 5;
  } else {
    analysis.recommendations.push('Considérez ajouter une meta robots pour contrôler l\'indexation');
  }

  const hasCanonical = $('link[rel="canonical"]').length > 0;
  if (hasCanonical) {
    score += 5;
  } else {
    analysis.recommendations.push('Ajoutez une URL canonique pour éviter le contenu dupliqué');
  }

  const hasOgTags = $('meta[property^="og:"]').length > 0;
  if (hasOgTags) {
    score += 10;
  } else {
    analysis.recommendations.push('Ajoutez des balises Open Graph pour améliorer le partage social');
  }

  analysis.score = Math.min(score, maxScore);
  
  return analysis;
}
