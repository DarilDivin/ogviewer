// Script de test pour vérifier les fonctionnalités
// Exécuter : node test-api.mjs

const testUrls = [
  'https://example.com',
  'https://github.com',
  'https://nextjs.org'
];

const analysisTypes = ['basic', 'seo', 'tech', 'performance'];

async function testAPI() {
  console.log('🧪 Test des fonctionnalités OGViewer\n');
  
  for (const analysisType of analysisTypes) {
    console.log(`📊 Test de l'analyse ${analysisType.toUpperCase()}`);
    
    try {
      const url = 'https://example.com';
      const response = await fetch(`http://localhost:3000/api/metadata?url=${encodeURIComponent(url)}&analysis=${analysisType}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ ${analysisType}: OK`);
        
        // Afficher quelques détails
        if (data.title) console.log(`      Titre: ${data.title}`);
        if (data.seo) console.log(`      Score SEO: ${data.seo.score}/100`);
        if (data.technologies) {
          const techCount = Object.values(data.technologies).flat().length;
          console.log(`      Technologies détectées: ${techCount}`);
        }
        if (data.performance) {
          if (data.performance.score) {
            console.log(`      Score performance: ${data.performance.score}/100`);
          } else if (data.performance.error) {
            console.log(`      Performance: ${data.performance.error}`);
          }
        }
      } else {
        console.log(`  ❌ ${analysisType}: Erreur ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${analysisType}: ${error.message}`);
    }
    
    console.log('');
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 Tests terminés !');
}

// Lancer les tests
testAPI().catch(console.error);
