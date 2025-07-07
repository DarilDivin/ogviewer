'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { 
  TechAnalysisRequest, 
  TechAnalysisResponse, 
  WappalyzerTechnology,
  GroupedTechnologies 
} from '@/types/wappalyzer';

export default function TechAnalyzer() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TechAnalysisResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setResult({
        success: false,
        error: 'Veuillez entrer une URL'
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/tech-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() } as TechAnalysisRequest),
      });

      const data: TechAnalysisResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      setResult({
        success: false,
        error: 'Erreur de connexion. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (confidence >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (confidence >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 80) return 'Très élevée';
    if (confidence >= 60) return 'Élevée';
    if (confidence >= 40) return 'Moyenne';
    return 'Faible';
  };

  const groupTechnologiesByCategory = (technologies: WappalyzerTechnology[]): GroupedTechnologies => {
    return technologies.reduce((groups, tech) => {
      tech.categories.forEach(category => {
        if (!groups[category.name]) {
          groups[category.name] = [];
        }
        // Éviter les doublons
        if (!groups[category.name].some(t => t.name === tech.name)) {
          groups[category.name].push(tech);
        }
      });
      return groups;
    }, {} as GroupedTechnologies);
  };

  const getCategoryIcon = (categoryName: string) => {
    const icons: { [key: string]: string } = {
      'CMS': '📝',
      'JavaScript frameworks': '⚛️',
      'Web frameworks': '🏗️',
      'Programming languages': '💻',
      'Databases': '🗄️',
      'Web servers': '🖥️',
      'Analytics': '📊',
      'CDN': '🌐',
      'Ecommerce': '🛒',
      'JavaScript libraries': '📚',
      'UI frameworks': '🎨',
      'Font scripts': '🔤',
      'Tag managers': '🏷️',
      'Payment processors': '💳',
      'Security': '🔒',
      'Operating systems': '💿',
      'Reverse proxies': '🔄',
      'Load balancers': '⚖️',
      'Caching': '⚡',
      'Widgets': '🧩',
      'Marketing automation': '📢',
      'A/B Testing': '🧪',
      'Live chat': '💬'
    };
    return icons[categoryName] || '🔧';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🔍 Analyseur de Technologies Web
            </h1>
            <p className="text-gray-600">
              Découvrez les technologies utilisées par n'importe quel site web
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  disabled={loading}
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyse...
                  </div>
                ) : (
                  'Analyser'
                )}
              </motion.button>
            </div>
          </form>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {!result.success ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="text-red-500 text-xl mr-3">❌</div>
                      <div>
                        <h3 className="text-red-800 font-semibold">Erreur d'analyse</h3>
                        <p className="text-red-700 mt-1">{result.error}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Statistiques de l'analyse */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">
                          ✅ Analyse terminée
                        </h2>
                        <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                          {result.data!.analysisTime}ms
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            {result.data!.totalTechnologies}
                          </div>
                          <div className="text-sm text-gray-600">Technologies détectées</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {Object.keys(groupTechnologiesByCategory(result.data!.technologies)).length}
                          </div>
                          <div className="text-sm text-gray-600">Catégories</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(result.data!.technologies.reduce((acc, tech) => acc + tech.confidence, 0) / result.data!.technologies.length)}%
                          </div>
                          <div className="text-sm text-gray-600">Confiance moyenne</div>
                        </div>
                      </div>
                    </div>

                    {/* Technologies groupées par catégorie */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(groupTechnologiesByCategory(result.data!.technologies)).map(([category, technologies]) => (
                        <motion.div
                          key={category}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-center mb-4">
                            <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                            <h3 className="font-semibold text-gray-800">{category}</h3>
                          </div>
                          
                          <div className="space-y-3">
                            {technologies.map((tech, index) => (
                              <div key={index} className="group">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <img 
                                      src={tech.icon}
                                      alt={tech.name}
                                      className="w-5 h-5"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <span className="font-medium text-gray-700">
                                      {tech.name}
                                      {tech.version && (
                                        <span className="text-xs text-gray-500 ml-1">
                                          v{tech.version}
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full border ${getConfidenceColor(tech.confidence)}`}>
                                    {tech.confidence}%
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Confiance: {getConfidenceLabel(tech.confidence)}
                                </div>
                                {tech.website && (
                                  <a 
                                    href={tech.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity block mt-1"
                                  >
                                    En savoir plus →
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                            {technologies.length} technologie{technologies.length > 1 ? 's' : ''}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Information sur l'API */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start">
                        <div className="text-blue-500 text-xl mr-3">ℹ️</div>
                        <div>
                          <h3 className="text-blue-800 font-semibold">Powered by Wappalyzer</h3>
                          <p className="text-blue-700 mt-1">
                            Analyse réalisée avec l'API officielle de Wappalyzer. 
                            Les données incluent les technologies détectées avec leur niveau de confiance.
                          </p>
                          <p className="text-xs text-blue-600 mt-2">
                            URL analysée: {result.data!.url}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
