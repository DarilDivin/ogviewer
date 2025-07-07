'use client';

import { motion } from "motion/react";

interface TechnologyDetectionProps {
  technologies: {
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
  } | string[]; // Support pour l'ancien format (array de strings)
}

export default function TechnologyDetection({ technologies }: TechnologyDetectionProps) {
  // Vérifier que technologies n'est pas null ou undefined
  if (!technologies) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">🔧</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Technologies détectées</h3>
        </div>
        <p className="text-gray-600">Aucune technologie spécifique détectée.</p>
      </motion.div>
    );
  }

  const getTechIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      frameworks: '⚛️',
      cms: '📝',
      analytics: '📊',
      libraries: '📚',
      cdn: '🌐',
      servers: '🖥️',
      languages: '💻',
      databases: '🗄️',
      ecommerce: '🛒',
      marketing: '📢',
      legacy: '🔧' // Pour l'ancien format
    };
    return icons[category] || '🔧';
  };

  const getCategoryName = (category: string) => {
    const names: { [key: string]: string } = {
      frameworks: 'Frameworks',
      cms: 'CMS',
      analytics: 'Analytics',
      libraries: 'Bibliothèques',
      cdn: 'CDN',
      servers: 'Serveurs',
      languages: 'Langages',
      databases: 'Bases de données',
      ecommerce: 'E-commerce',
      marketing: 'Marketing',
      legacy: 'Technologies détectées'
    };
    return names[category] || category;
  };

  // Gérer l'ancien format (array de strings) et le nouveau format (objet)
  let techEntries: [string, string[]][] = [];
  
  if (Array.isArray(technologies)) {
    // Ancien format : array de strings
    if (technologies.length > 0) {
      techEntries = [['legacy', technologies]];
    }
  } else {
    // Nouveau format : objet avec catégories
    techEntries = Object.entries(technologies).filter(([_, items]) => items && items.length > 0);
  }

  if (techEntries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-lg">🔧</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Technologies détectées</h3>
        </div>
        <p className="text-gray-600">Aucune technologie spécifique détectée.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-2xl border border-border shadow-sm p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-chart-3/20 rounded-lg flex items-center justify-center">
            <span className="text-chart-3 text-lg">🔧</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Technologies détectées</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">
            {techEntries.reduce((total, [_, items]) => total + items.length, 0)}
          </div>
          <div className="text-sm text-muted-foreground">technologies</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techEntries.map(([category, items]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/50 rounded-xl p-6 hover:bg-muted transition-colors"
          >
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center mr-3 shadow-sm border border-border">
                <span className="text-lg">{getTechIcon(category)}</span>
              </div>
              <h4 className="font-semibold text-foreground">{getCategoryName(category)}</h4>
            </div>
            
            <div className="space-y-2">
              {items.map((tech: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center p-2 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <span className="text-foreground font-medium text-sm flex-1">{tech}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-muted-foreground text-center">
              {items.length} élément{items.length > 1 ? 's' : ''}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
