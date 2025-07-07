// Script de test pour l'API tech-analyzer
const API_URL = 'http://localhost:3002/api/tech-analyzer';

const testUrls = [
  'https://nextjs.org',
  'https://react.dev',
  'https://vuejs.org',
  'https://angular.io',
  'https://tailwindcss.com'
];

async function testTechAnalyzer(url) {
  console.log(`🧪 Test de ${url}...`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ ${data.data.totalTechnologies} technologies détectées en ${data.data.analysisTime}ms`);
      console.log(`🔧 Technologies principales:`, 
        data.data.technologies
          .slice(0, 5)
          .map(tech => `${tech.name} (${tech.confidence}%)`)
          .join(', ')
      );
    } else {
      console.log(`❌ Erreur: ${data.error}`);
    }
  } catch (error) {
    console.log(`❌ Erreur de connexion: ${error.message}`);
  }
  
  console.log('─'.repeat(50));
}

async function runTests() {
  console.log('🚀 Test de l\'API tech-analyzer\n');
  
  for (const url of testUrls) {
    await testTechAnalyzer(url);
    // Pause entre les requêtes pour éviter la limite de taux
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

runTests().catch(console.error);
