'use client';

import { motion } from "motion/react";

interface SEOAnalysisProps {
  seo: {
    score: number;
    issues: string[];
    recommendations: string[];
    details: {
      title: { exists: boolean; length: number; optimal: boolean };
      description: { exists: boolean; length: number; optimal: boolean };
      headings: { h1Count: number; h2Count: number; h3Count: number; hasH1: boolean; multipleH1: boolean };
      images: { total: number; withAlt: number; withoutAlt: number; altCoverage: number };
      links: { internal: number; external: number; nofollow: number };
    };
  };
}

export default function SEOAnalysis({ seo }: SEOAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-6 mt-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Analyse SEO</h3>
        <div className={`${getScoreBg(seo.score)} px-4 py-2 rounded-full`}>
          <span className={`text-2xl font-bold ${getScoreColor(seo.score)}`}>
            {seo.score}/100
          </span>
        </div>
      </div>

      {/* Score details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Titre</h4>
          <p className="text-sm text-gray-600">
            {seo.details.title.exists ? 
              `${seo.details.title.length} caractères` : 
              'Manquant'
            }
          </p>
          <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
            <div 
              className={`h-2 rounded-full ${seo.details.title.optimal ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: seo.details.title.exists ? '100%' : '0%' }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Description</h4>
          <p className="text-sm text-gray-600">
            {seo.details.description.exists ? 
              `${seo.details.description.length} caractères` : 
              'Manquante'
            }
          </p>
          <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
            <div 
              className={`h-2 rounded-full ${seo.details.description.optimal ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: seo.details.description.exists ? '100%' : '0%' }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Titres</h4>
          <p className="text-sm text-gray-600">
            H1: {seo.details.headings.h1Count}, H2: {seo.details.headings.h2Count}
          </p>
          <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
            <div 
              className={`h-2 rounded-full ${seo.details.headings.hasH1 && !seo.details.headings.multipleH1 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: seo.details.headings.hasH1 ? '100%' : '0%' }}
            ></div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Images</h4>
          <p className="text-sm text-gray-600">
            {seo.details.images.altCoverage.toFixed(0)}% avec alt
          </p>
          <div className={`w-full bg-gray-200 rounded-full h-2 mt-2`}>
            <div 
              className={`h-2 rounded-full ${seo.details.images.altCoverage === 100 ? 'bg-green-500' : 'bg-yellow-500'}`}
              style={{ width: `${seo.details.images.altCoverage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Issues and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {seo.issues.length > 0 && (
          <div>
            <h4 className="font-semibold text-red-600 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Problèmes détectés
            </h4>
            <ul className="space-y-2">
              {seo.issues.map((issue, index) => (
                <li key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {seo.recommendations.length > 0 && (
          <div>
            <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Recommandations
            </h4>
            <ul className="space-y-2">
              {seo.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
