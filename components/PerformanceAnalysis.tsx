'use client';

import { motion } from "motion/react";

interface PerformanceAnalysisProps {
  performance: {
    score: number;
    metrics: {
      firstContentfulPaint?: number;
      largestContentfulPaint?: number;
      firstInputDelay?: number;
      cumulativeLayoutShift?: number;
      speedIndex?: number;
      timeToInteractive?: number;
      responseTime?: number;
      ttfb?: number;
      contentSize?: number;
      statusCode?: number;
    };
    opportunities?: Array<{
      id: string;
      title: string;
      description: string;
      score: number;
      numericValue: number;
    }>;
    diagnostics?: Array<{
      id: string;
      title: string;
      description: string;
      score: number;
    }>;
    recommendations?: string[];
    loadingTime?: number;
    resourceSizes?: {
      html: number;
      css: number;
      javascript: number;
      images: number;
      fonts: number;
      other: number;
      total: number;
    };
    timestamp?: number;
  } | { error: string };
}

export default function PerformanceAnalysis({ performance }: PerformanceAnalysisProps) {
  if ('error' in performance) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 mt-6"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Analyse de Performance</h3>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">❌ {performance.error}</p>
        </div>
      </motion.div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 75) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const formatTime = (ms?: number) => {
    if (!ms) return 'N/A';
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const getMetricStatus = (metric: string, value?: number) => {
    if (!value) return 'unknown';
    const thresholds: { [key: string]: { good: number; poor: number } } = {
      firstContentfulPaint: { good: 1800, poor: 3000 },
      largestContentfulPaint: { good: 2500, poor: 4000 },
      firstInputDelay: { good: 100, poor: 300 },
      cumulativeLayoutShift: { good: 0.1, poor: 0.25 },
      speedIndex: { good: 3400, poor: 5800 },
      timeToInteractive: { good: 3800, poor: 7300 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-xl shadow-lg p-6 mt-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Analyse de Performance</h3>
        <div className={`${getScoreBg(performance.score)} px-4 py-2 rounded-full`}>
          <span className={`text-2xl font-bold ${getScoreColor(performance.score)}`}>
            {performance.score}/100
          </span>
        </div>
      </div>

      {/* Advanced metrics (Core Web Vitals) - only if available */}
      {performance.metrics.largestContentfulPaint && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Core Web Vitals</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-700">LCP</h5>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(getMetricStatus('largestContentfulPaint', performance.metrics.largestContentfulPaint))}`}>
                  {getMetricStatus('largestContentfulPaint', performance.metrics.largestContentfulPaint)}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatTime(performance.metrics.largestContentfulPaint)}
              </p>
              <p className="text-sm text-gray-600">Largest Contentful Paint</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-700">FID</h5>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(getMetricStatus('firstInputDelay', performance.metrics.firstInputDelay))}`}>
                  {getMetricStatus('firstInputDelay', performance.metrics.firstInputDelay)}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {formatTime(performance.metrics.firstInputDelay)}
              </p>
              <p className="text-sm text-gray-600">First Input Delay</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-700">CLS</h5>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(getMetricStatus('cumulativeLayoutShift', performance.metrics.cumulativeLayoutShift))}`}>
                  {getMetricStatus('cumulativeLayoutShift', performance.metrics.cumulativeLayoutShift)}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {performance.metrics.cumulativeLayoutShift?.toFixed(3) || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Cumulative Layout Shift</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic metrics - always show if available */}
      {(performance.metrics.responseTime || performance.metrics.firstContentfulPaint) && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">
            {performance.metrics.responseTime ? 'Métriques de base' : 'Métriques supplémentaires'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {performance.metrics.responseTime && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Temps de réponse</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(performance.metrics.responseTime)}
                </p>
              </div>
            )}
            {performance.metrics.ttfb && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">TTFB</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(performance.metrics.ttfb)}
                </p>
              </div>
            )}
            {performance.metrics.contentSize && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Taille du contenu</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatBytes(performance.metrics.contentSize)}
                </p>
              </div>
            )}
            {performance.metrics.firstContentfulPaint && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">First Contentful Paint</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(performance.metrics.firstContentfulPaint)}
                </p>
              </div>
            )}
            {performance.metrics.speedIndex && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Speed Index</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(performance.metrics.speedIndex)}
                </p>
              </div>
            )}
            {performance.metrics.timeToInteractive && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Time to Interactive</p>
                <p className="text-lg font-semibold text-gray-800">
                  {formatTime(performance.metrics.timeToInteractive)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resource Sizes - only if available */}
      {performance.resourceSizes && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Taille des ressources</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">📄</span>
              </div>
              <p className="text-sm text-gray-600">HTML</p>
              <p className="font-semibold">{formatBytes(performance.resourceSizes.html)}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">🎨</span>
              </div>
              <p className="text-sm text-gray-600">CSS</p>
              <p className="font-semibold">{formatBytes(performance.resourceSizes.css)}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-600 font-bold">⚡</span>
              </div>
              <p className="text-sm text-gray-600">JS</p>
              <p className="font-semibold">{formatBytes(performance.resourceSizes.javascript)}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">🖼️</span>
              </div>
              <p className="text-sm text-gray-600">Images</p>
              <p className="font-semibold">{formatBytes(performance.resourceSizes.images)}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">🔤</span>
              </div>
              <p className="text-sm text-gray-600">Fonts</p>
              <p className="font-semibold">{formatBytes(performance.resourceSizes.fonts)}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-gray-600 font-bold">📦</span>
              </div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="font-semibold">{formatBytes(performance.resourceSizes.total)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations - for basic analysis */}
      {performance.recommendations && performance.recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Recommandations</h4>
          <div className="space-y-2">
            {performance.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-blue-800 text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities - for advanced analysis */}
      {performance.opportunities && performance.opportunities.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Opportunités d'amélioration</h4>
          <div className="space-y-3">
            {performance.opportunities.slice(0, 5).map((opportunity, index) => (
              <div key={opportunity.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-medium text-orange-800">{opportunity.title}</h5>
                    <p className="text-sm text-orange-700 mt-1">{opportunity.description}</p>
                  </div>
                  <span className="text-orange-600 font-semibold ml-4">
                    {formatTime(opportunity.numericValue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
        ⏱️ {performance.loadingTime ? `Temps d'analyse : ${formatTime(performance.loadingTime)}` : 'Analyse terminée'} • 
        {performance.metrics.responseTime ? 'Analyse de base' : 'Analyse avancée avec Puppeteer'}
      </div>
    </motion.div>
  );
}
