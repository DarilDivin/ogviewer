#!/usr/bin/env node

/**
 * Test script for the new official Wappalyzer and Lighthouse integrations
 */

import { detectTechnologies, convertToLegacyFormat } from '../lib/technology-detector.js';
import { analyzePerformance } from '../lib/performance-analyzer.js';

const testUrl = 'https://example.com';

async function testWappalyzer() {
  console.log('🔍 Testing Wappalyzer integration...');
  try {
    const result = await detectTechnologies(testUrl);
    console.log('✅ Wappalyzer Result:', {
      url: result.url,
      totalTechnologies: result.total,
      detectionTime: `${result.detectionTime}ms`,
      technologies: result.technologies.slice(0, 5).map(tech => ({
        name: tech.name,
        category: tech.category,
        confidence: tech.confidence,
        version: tech.version
      }))
    });

    // Test legacy format conversion
    const legacy = convertToLegacyFormat(result);
    console.log('🔄 Legacy Format:', {
      frameworks: legacy.frameworks,
      servers: legacy.servers,
      languages: legacy.languages
    });
  } catch (error) {
    console.error('❌ Wappalyzer test failed:', error.message);
  }
}

async function testLighthouse() {
  console.log('\n🚀 Testing Lighthouse integration...');
  try {
    const result = await analyzePerformance(testUrl);
    console.log('✅ Lighthouse Result:', {
      url: result.url,
      analysisTime: `${result.analysisTime}ms`,
      scores: {
        performance: result.performanceScore,
        accessibility: result.accessibilityScore,
        bestPractices: result.bestPracticesScore,
        seo: result.seoScore
      },
      coreWebVitals: {
        FCP: `${Math.round(result.firstContentfulPaint)}ms`,
        LCP: `${Math.round(result.largestContentfulPaint)}ms`,
        CLS: result.cumulativeLayoutShift.toFixed(3),
        TTI: `${Math.round(result.timeToInteractive)}ms`
      },
      opportunities: result.opportunities.length,
      diagnostics: result.diagnostics.length
    });
  } catch (error) {
    console.error('❌ Lighthouse test failed:', error.message);
  }
}

async function main() {
  console.log('🧪 Testing Official API Integrations\n');
  
  await testWappalyzer();
  await testLighthouse();
  
  console.log('\n🎉 Test completed!');
}

main().catch(console.error);
