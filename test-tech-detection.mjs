// Script de test pour valider la détection de technologies
import { detectTechnologies } from './lib/technology-detector.js';

const testUrls = [
  { url: 'https://nextjs.org', expected: ['Next.js'] },
  { url: 'https://react.dev', expected: ['React'] },
  { url: 'https://angular.io', expected: ['Angular'] },
  { url: 'https://vuejs.org', expected: ['Vue.js'] },
  { url: 'https://tailwindcss.com', expected: ['Tailwind CSS'] },
  { url: 'https://getbootstrap.com', expected: ['Bootstrap'] }
];

async function runTests() {
  console.log('🧪 Test de détection de technologies\n');
  
  for (const test of testUrls) {
    console.log(`🌐 Test: ${test.url}`);
    console.log(`📝 Attendu: ${test.expected.join(', ')}`);
    
    try {
      const result = await detectTechnologies(test.url);
      const detected = result.technologies.map(t => t.name);
      
      console.log(`✅ Détecté: ${detected.join(', ')}`);
      console.log(`📊 Confiance: ${result.technologies.map(t => `${t.name}(${Math.round(t.confidence)}%)`).join(', ')}`);
      
      // Vérifier si les technologies attendues sont détectées
      const hasExpected = test.expected.some(exp => detected.includes(exp));
      console.log(hasExpected ? '✅ SUCCÈS' : '❌ ÉCHEC');
      
    } catch (error) {
      console.log(`❌ ERREUR: ${error.message}`);
    }
    
    console.log('─'.repeat(50));
  }
}

runTests().catch(console.error);
