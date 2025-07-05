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
        className="bg-white rounded-xl shadow-lg p-6 mt-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Technologies détectées</h3>
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
        className="bg-white rounded-xl shadow-lg p-6 mt-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Technologies détectées</h3>
        <p className="text-gray-600">Aucune technologie spécifique détectée.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 mt-6"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-6">Technologies détectées</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {techEntries.map(([category, items]) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">{getTechIcon(category)}</span>
              <h4 className="font-semibold text-gray-800">{getCategoryName(category)}</h4>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {items.map((tech: string, index: number) => (
                <span
                  key={index}
                  className="inline-block bg-white text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm border border-gray-200"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <div className="mt-2 text-xs text-gray-500">
              {items.length} élément{items.length > 1 ? 's' : ''} détecté{items.length > 1 ? 's' : ''}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm text-blue-800 font-medium">Information</p>
            <p className="text-sm text-blue-700 mt-1">
              Cette détection est basée sur l'analyse du code HTML, des scripts inclus, et des headers HTTP. 
              Certaines technologies peuvent ne pas être détectées si elles sont chargées dynamiquement.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
