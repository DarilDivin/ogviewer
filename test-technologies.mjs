// Test spécifique pour vérifier le format des technologies
// Exécuter : node test-technologies.mjs

async function testTechnologiesFormat() {
  console.log('🔧 Test du format des technologies\n');
  
  const testCases = [
    { analysis: 'basic', description: 'Format de base' },
    { analysis: 'tech', description: 'Format avancé' },
    { analysis: 'full', description: 'Format complet' }
  ];
  
  for (const testCase of testCases) {
    console.log(`📊 Test ${testCase.description} (${testCase.analysis})`);
    
    try {
      const url = 'https://github.com'; // Site avec plus de technologies
      const response = await fetch(`http://localhost:3000/api/metadata?url=${encodeURIComponent(url)}&analysis=${testCase.analysis}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`  ✅ ${testCase.analysis}: OK`);
        
        if (data.technologies) {
          console.log(`      Format technologies:`, typeof data.technologies);
          
          if (Array.isArray(data.technologies)) {
            console.log(`      Array avec ${data.technologies.length} éléments`);
            if (data.technologies.length > 0) {
              console.log(`      Premier élément: ${data.technologies[0]}`);
            }
          } else if (typeof data.technologies === 'object') {
            const categories = Object.keys(data.technologies);
            console.log(`      Objet avec catégories: ${categories.join(', ')}`);
            
            // Compter le total des technologies
            const total = Object.values(data.technologies).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
            console.log(`      Total technologies: ${total}`);
            
            // Afficher quelques exemples
            for (const [category, items] of Object.entries(data.technologies)) {
              if (Array.isArray(items) && items.length > 0) {
                console.log(`        ${category}: ${items.slice(0, 2).join(', ')}${items.length > 2 ? '...' : ''}`);
              }
            }
          }
        } else {
          console.log(`      Pas de technologies détectées`);
        }
      } else {
        console.log(`  ❌ ${testCase.analysis}: Erreur ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ ${testCase.analysis}: ${error.message}`);
    }
    
    console.log('');
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 Tests terminés !');
}

// Lancer les tests
testTechnologiesFormat().catch(console.error);
