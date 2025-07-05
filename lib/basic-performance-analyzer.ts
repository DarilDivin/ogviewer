import axios from 'axios';

export interface BasicPerformanceMetrics {
  score: number;
  metrics: {
    responseTime: number;
    ttfb: number;
    contentSize: number;
    statusCode: number;
  };
  recommendations: string[];
  timestamp: number;
}

export async function analyzeBasicPerformance(url: string): Promise<BasicPerformanceMetrics> {
  const startTime = Date.now();
  
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'OGViewer Performance Analyzer/1.0'
      }
    });
    
    const responseTime = Date.now() - startTime;
    const contentSize = Buffer.byteLength(response.data, 'utf8');
    
    // Calculate basic score
    let score = 100;
    const recommendations: string[] = [];
    
    // Response time scoring
    if (responseTime > 3000) {
      score -= 30;
      recommendations.push('Temps de réponse très lent (>3s) - Optimisez votre serveur');
    } else if (responseTime > 1500) {
      score -= 15;
      recommendations.push('Temps de réponse lent (>1.5s) - Considérez un CDN');
    } else if (responseTime > 800) {
      score -= 8;
      recommendations.push('Temps de réponse correct mais perfectible');
    }
    
    // Content size scoring
    if (contentSize > 1024 * 1024) { // > 1MB
      score -= 20;
      recommendations.push('HTML très volumineux (>1MB) - Compressez le contenu');
    } else if (contentSize > 512 * 1024) { // > 512KB
      score -= 10;
      recommendations.push('HTML volumineux (>512KB) - Activez la compression gzip');
    }
    
    // Headers analysis
    const headers = response.headers;
    if (!headers['content-encoding']) {
      score -= 10;
      recommendations.push('Compression non activée - Activez gzip/brotli');
    }
    
    if (!headers['cache-control']) {
      score -= 5;
      recommendations.push('Headers de cache manquants');
    }
    
    if (!headers['content-security-policy']) {
      recommendations.push('Considérez ajouter une Content Security Policy');
    }
    
    score = Math.max(0, Math.min(100, score));
    
    return {
      score: Math.round(score),
      metrics: {
        responseTime,
        ttfb: responseTime, // Simplified - same as response time for basic analysis
        contentSize,
        statusCode: response.status,
      },
      recommendations,
      timestamp: Date.now(),
    };
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      score: 0,
      metrics: {
        responseTime,
        ttfb: responseTime,
        contentSize: 0,
        statusCode: 0,
      },
      recommendations: [
        'Erreur lors de l\'analyse de performance',
        'Vérifiez que le site est accessible',
        error instanceof Error ? error.message : 'Erreur inconnue'
      ],
      timestamp: Date.now(),
    };
  }
}
