// Types pour l'API Wappalyzer officielle
export interface WappalyzerTechnology {
  name: string;
  confidence: number;
  version?: string;
  icon: string;
  website: string;
  cpe?: string;
  categories: WappalyzerCategory[];
}

export interface WappalyzerCategory {
  id: number;
  slug: string;
  name: string;
}

export interface WappalyzerResponse {
  url: string;
  technologies: WappalyzerTechnology[];
}

export interface WappalyzerApiResponse {
  [url: string]: WappalyzerResponse;
}

// Types pour notre application
export interface TechAnalysisRequest {
  url: string;
}

export interface TechAnalysisResponse {
  success: boolean;
  data?: {
    url: string;
    technologies: WappalyzerTechnology[];
    totalTechnologies: number;
    analysisTime: number;
  };
  error?: string;
}

// Types pour l'affichage groupé
export interface GroupedTechnologies {
  [categoryName: string]: WappalyzerTechnology[];
}
