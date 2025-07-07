'use client';

import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";

interface PerformanceAnalysisProps {
  performance: {
    // PageSpeed Insights format
    performanceScore?: number;
    accessibilityScore?: number;
    bestPracticesScore?: number;
    seoScore?: number;
    firstContentfulPaint?: number;
    largestContentfulPaint?: number;
    cumulativeLayoutShift?: number;
    firstInputDelay?: number;
    interactionToNextPaint?: number;
    timeToInteractive?: number;
    speedIndex?: number;
    totalBlockingTime?: number;
    analysisTime?: number;
    url?: string;
    userAgent?: string;
    opportunities?: Array<{
      id: string;
      title: string;
      description: string;
      score: number;
      numericValue: number;
      displayValue: string;
    }>;
    diagnostics?: Array<{
      id: string;
      title: string;
      description: string;
      score: number;
      displayValue: string;
    }>;
  } | { error: string };
  screenshot?: string | null;
}

// Composant CircularScore amélioré pour les cercles de score
const CircularScore = ({ score, label, size = 80 }: { score: number; label: string; size?: number }) => {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${(score / 100) * circumference} ${circumference}`;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "#10b981"; // green-500
    if (score >= 50) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return "from-green-500/20 to-green-500/5";
    if (score >= 50) return "from-amber-500/20 to-amber-500/5";
    return "from-red-500/20 to-red-500/5";
  };

  return (
    <div className="flex flex-col items-center group">
      <div 
        className={`relative bg-gradient-to-br ${getScoreGradient(score)} rounded-2xl p-4 border border-border/50 hover:border-border transition-all duration-300`} 
        style={{ width: size + 32, height: size + 32 }}
      >
        <div className="relative" style={{ width: size, height: size }}>
          <svg className="transform -rotate-90" width={size} height={size}>
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth="3"
              fill="transparent"
              className="text-muted/10"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getScoreColor(score)}
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out drop-shadow-sm"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{score}</span>
          </div>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground mt-3 text-center group-hover:text-foreground transition-colors">
        {label}
      </span>
    </div>
  );
};

export default function PerformanceAnalysis({ performance, screenshot }: PerformanceAnalysisProps) {
  if ('error' in performance) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl border border-border shadow-sm p-8"
      >
        <h3 className="text-2xl font-bold text-foreground mb-4">Analyse de Performance</h3>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">❌ {performance.error}</p>
          <p className="text-destructive/80 text-sm mt-2">
            L'analyse PageSpeed Insights a échoué. Veuillez vérifier que l'URL est accessible et réessayer.
          </p>
        </div>
      </motion.div>
    );
  }

  const formatMetricValue = (value?: number, type: 'time' | 'score' | 'cls' = 'time') => {
    if (value === undefined) return 'N/A';
    
    switch (type) {
      case 'time':
        if (value < 1000) return `${Math.round(value)} ms`;
        return `${(value / 1000).toFixed(1)} s`;
      case 'cls':
        return value.toFixed(3);
      case 'score':
      default:
        return value.toString();
    }
  };

  const getMetricColor = (metric: string, value?: number) => {
    if (value === undefined) return 'text-muted-foreground';
    
    switch (metric) {
      case 'firstContentfulPaint':
        if (value <= 1800) return 'text-green-500';
        if (value <= 3000) return 'text-amber-500';
        return 'text-red-500';
      case 'largestContentfulPaint':
        if (value <= 2500) return 'text-green-500';
        if (value <= 4000) return 'text-amber-500';
        return 'text-red-500';
      case 'totalBlockingTime':
        if (value <= 200) return 'text-green-500';
        if (value <= 600) return 'text-amber-500';
        return 'text-red-500';
      case 'cumulativeLayoutShift':
        if (value <= 0.1) return 'text-green-500';
        if (value <= 0.25) return 'text-amber-500';
        return 'text-red-500';
      case 'speedIndex':
        if (value <= 3400) return 'text-green-500';
        if (value <= 5800) return 'text-amber-500';
        return 'text-red-500';
      default:
        return 'text-foreground';
    }
  };

  const getScoreRange = (score: number) => {
    if (score >= 90) return { color: 'text-green-500', range: '90-100' };
    if (score >= 50) return { color: 'text-amber-500', range: '50-89' };
    return { color: 'text-red-500', range: '0-49' };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="overflow-hidden" // bg-card rounded-2xl border border-border
    >
      {/* En-tête avec icône et titre */}
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl text-left font-bold text-foreground">Analyse de Performance</h3>
              <p className="text-sm text-left text-muted-foreground">Powered by Google PageSpeed Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
              PageSpeed Insights
            </div>
          </div>
        </div>

        {/* PageSpeed Insights Scores with Screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* PageSpeed Insights Scores */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2  gap-4">
              {performance.performanceScore !== undefined && (
                <CircularScore 
                  score={performance.performanceScore} 
                  label="Performance" 
                  size={80}
                />
              )}
              {performance.accessibilityScore !== undefined && (
                <CircularScore 
                  score={performance.accessibilityScore} 
                  label="Accessibilité" 
                  size={80}
                />
              )}
              {performance.bestPracticesScore !== undefined && (
                <CircularScore 
                  score={performance.bestPracticesScore} 
                  label="Bonnes Pratiques" 
                  size={80}
                />
              )}
              {performance.seoScore !== undefined && (
                <CircularScore 
                  score={performance.seoScore} 
                  label="SEO" 
                  size={80}
                />
              )}
            </div>
          </div>

          {/* Screenshot */}
          {/* {screenshot && ( */}
            <div className="lg:col-span-2">
              <div className="bg-muted/30 rounded-xl border border-border p-4 h-full">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-muted-foreground">Aperçu de la Page</span>
                </div>
                <div className="rounded-lg overflow-hidden border border-border bg-background shadow-sm">
                  {screenshot ? (
                    <img
                      src={screenshot}
                      alt="Screenshot de la page"
                      className="w-full h-auto object-cover"
                      // style={{ maxHeight: '200px' }}
                    />
                  ) : (
                    <Skeleton className="w-full h-[300px]" />
                  )}
                </div>
              </div>
            </div>
          {/* )} */}
        </div>
      </div>

      {/* Section Métriques Détaillées */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xl text-left font-semibold text-foreground">Métriques de Performance</h4>
            <p className="text-sm text-left text-muted-foreground">Core Web Vitals et métriques PageSpeed Insights</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Colonne Gauche */}
          <div className="space-y-4">
            {performance.firstContentfulPaint !== undefined && (
              <div className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMetricColor('firstContentfulPaint', performance.firstContentfulPaint).replace('text-', 'bg-')} shadow-sm`}></div>
                    <div>
                      <span className="font-medium text-left text-foreground">Premier Contenu Visible</span>
                      <p className="text-xs text-left text-muted-foreground">First Contentful Paint</p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-lg ${getMetricColor('firstContentfulPaint', performance.firstContentfulPaint)}`}>
                    {formatMetricValue(performance.firstContentfulPaint)}
                  </span>
                </div>
              </div>
            )}

            {performance.totalBlockingTime !== undefined && (
              <div className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMetricColor('totalBlockingTime', performance.totalBlockingTime).replace('text-', 'bg-')} shadow-sm`}></div>
                    <div>
                      <span className="font-medium text-left text-foreground">Temps de Blocage Total</span>
                      <p className="text-xs text-left text-muted-foreground">Total Blocking Time</p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-lg ${getMetricColor('totalBlockingTime', performance.totalBlockingTime)}`}>
                    {formatMetricValue(performance.totalBlockingTime)}
                  </span>
                </div>
              </div>
            )}

            {performance.speedIndex !== undefined && (
              <div className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMetricColor('speedIndex', performance.speedIndex).replace('text-', 'bg-')} shadow-sm`}></div>
                    <div>
                      <span className="font-medium text-left text-foreground">Indice de Vitesse</span>
                      <p className="text-xs text-left text-muted-foreground">Speed Index</p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-lg ${getMetricColor('speedIndex', performance.speedIndex)}`}>
                    {formatMetricValue(performance.speedIndex)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Colonne Droite */}
          <div className="space-y-4">
            {performance.largestContentfulPaint !== undefined && (
              <div className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMetricColor('largestContentfulPaint', performance.largestContentfulPaint).replace('text-', 'bg-')} shadow-sm`}></div>
                    <div>
                      <span className="font-medium text-left text-foreground">Plus Grand Contenu Visible</span>
                      <p className="text-xs text-left text-muted-foreground">Largest Contentful Paint</p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-lg ${getMetricColor('largestContentfulPaint', performance.largestContentfulPaint)}`}>
                    {formatMetricValue(performance.largestContentfulPaint)}
                  </span>
                </div>
              </div>
            )}

            {performance.cumulativeLayoutShift !== undefined && (
              <div className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getMetricColor('cumulativeLayoutShift', performance.cumulativeLayoutShift).replace('text-', 'bg-')} shadow-sm`}></div>
                    <div>
                      <span className="font-medium text-left text-foreground">Décalage Cumulatif</span>
                      <p className="text-xs text-left text-muted-foreground">Cumulative Layout Shift</p>
                    </div>
                  </div>
                  <span className={`font-mono font-bold text-lg ${getMetricColor('cumulativeLayoutShift', performance.cumulativeLayoutShift)}`}>
                    {formatMetricValue(performance.cumulativeLayoutShift, 'cls')}
                  </span>
                </div>
              </div>
            )}

            {performance.timeToInteractive !== undefined && (
              <div className="group p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-blue-500 shadow-sm`}></div>
                    <div>
                      <span className="font-medium text-foreground">Temps d'Interactivité</span>
                      <p className="text-xs text-left text-muted-foreground">Time to Interactive</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-lg text-blue-600">
                    {formatMetricValue(performance.timeToInteractive)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Score breakdown */}
        <div className="mt-8 p-6 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h5 className="font-medium text-foreground">Interprétation des Scores</h5>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">90-100: Excellent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span className="text-muted-foreground">50-89: À améliorer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">0-49: Mauvais</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
