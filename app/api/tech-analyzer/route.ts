import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import validator from 'validator';
import type { 
  TechAnalysisRequest, 
  TechAnalysisResponse, 
  WappalyzerApiResponse 
} from '@/types/wappalyzer';

// Forcer le runtime Node.js pour l'accès aux variables d'environnement
export const runtime = 'nodejs';

const WAPPALYZER_API_URL = 'https://api.wappalyzer.com/v2/lookup/';
const API_KEY = process.env.WAPPALYZER_API_KEY;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Vérifier que la clé API est configurée
    if (!API_KEY) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Clé API Wappalyzer non configurée. Ajoutez WAPPALYZER_API_KEY dans .env.local' 
        } as TechAnalysisResponse,
        { status: 500 }
      );
    }

    // Parser le body de la requête
    const body: TechAnalysisRequest = await request.json();
    const { url } = body;

    // Validation de l'URL
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL manquante' } as TechAnalysisResponse,
        { status: 400 }
      );
    }

    if (!validator.isURL(url, { require_protocol: true })) {
      return NextResponse.json(
        { success: false, error: 'URL invalide. Assurez-vous d\'inclure http:// ou https://' } as TechAnalysisResponse,
        { status: 400 }
      );
    }

    // Sécurité : bloquer les adresses internes
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    const hostname = new URL(url).hostname.toLowerCase();
    
    if (blockedHosts.includes(hostname) || hostname.includes('192.168.') || hostname.includes('10.') || hostname.includes('172.')) {
      return NextResponse.json(
        { success: false, error: 'Accès aux adresses internes non autorisé' } as TechAnalysisResponse,
        { status: 403 }
      );
    }

    // Appel à l'API Wappalyzer
    console.log(`🔍 Analyse de ${url} avec Wappalyzer...`);
    
    const wappalyzerResponse = await axios.get<WappalyzerApiResponse>(WAPPALYZER_API_URL, {
      params: {
        urls: url
      },
      headers: {
        'X-Api-Key': API_KEY,
        'User-Agent': 'OGViewer/1.0.0'
      },
      timeout: 30000 // 30 secondes timeout
    });

    const analysisTime = Date.now() - startTime;

    // Extraire les données pour l'URL analysée
    const urlData = wappalyzerResponse.data[url];
    
    if (!urlData) {
      return NextResponse.json(
        { success: false, error: 'Aucune donnée retournée par Wappalyzer pour cette URL' } as TechAnalysisResponse,
        { status: 404 }
      );
    }

    // Trier les technologies par confiance (ordre décroissant)
    const technologies = urlData.technologies.sort((a, b) => b.confidence - a.confidence);

    console.log(`✅ Analyse terminée : ${technologies.length} technologies détectées en ${analysisTime}ms`);

    return NextResponse.json({
      success: true,
      data: {
        url: urlData.url,
        technologies,
        totalTechnologies: technologies.length,
        analysisTime
      }
    } as TechAnalysisResponse);

  } catch (error) {
    const analysisTime = Date.now() - startTime;
    console.error('❌ Erreur lors de l\'analyse:', error);

    // Gestion des erreurs spécifiques
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 401:
          return NextResponse.json(
            { success: false, error: 'Clé API Wappalyzer invalide ou expirée' } as TechAnalysisResponse,
            { status: 401 }
          );
        case 403:
          return NextResponse.json(
            { success: false, error: 'Accès non autorisé à l\'API Wappalyzer' } as TechAnalysisResponse,
            { status: 403 }
          );
        case 429:
          return NextResponse.json(
            { success: false, error: 'Limite de taux API atteinte. Veuillez réessayer plus tard.' } as TechAnalysisResponse,
            { status: 429 }
          );
        case 404:
          return NextResponse.json(
            { success: false, error: 'URL introuvable ou inaccessible' } as TechAnalysisResponse,
            { status: 404 }
          );
        default:
          return NextResponse.json(
            { success: false, error: `Erreur API Wappalyzer: ${message}` } as TechAnalysisResponse,
            { status: status || 500 }
          );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur lors de l\'analyse des technologies' 
      } as TechAnalysisResponse,
      { status: 500 }
    );
  }
}

// Méthode GET pour les tests (optionnel)
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API d\'analyse de technologies',
    method: 'POST',
    endpoint: '/api/tech-analyzer',
    required: ['url'],
    example: {
      url: 'https://example.com'
    }
  });
}
