# 🔍 Analyseur de Technologies Web

Analyseur de technologies basé sur l'API officielle de Wappalyzer pour détecter les frameworks, bibliothèques, CMS et autres technologies utilisés par n'importe quel site web.

## 🚀 Configuration

### 1. Clé API Wappalyzer

1. Rendez-vous sur [Wappalyzer API](https://www.wappalyzer.com/api/)
2. Créez un compte et obtenez votre clé API
3. Ajoutez la clé dans le fichier `.env.local` :

```env
WAPPALYZER_API_KEY=votre_cle_api_ici
```

### 2. Installation des dépendances

```bash
npm install axios validator
npm install -D @types/validator
```

## 📁 Structure des fichiers

```
app/
├── api/tech-analyzer/route.ts    # API route pour l'analyse
├── tech/page.tsx                 # Page de l'analyseur
components/
├── TechAnalyzer.tsx              # Composant principal
types/
├── wappalyzer.ts                 # Types TypeScript
```

## 🎯 Utilisation

### Interface Web

1. Accédez à `/tech` dans votre application
2. Entrez une URL (ex: `https://nextjs.org`)
3. Cliquez sur "Analyser"
4. Visualisez les technologies détectées avec leurs niveaux de confiance

### API REST

#### POST `/api/tech-analyzer`

**Body:**
```json
{
  "url": "https://example.com"
}
```

**Response (succès):**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "technologies": [
      {
        "name": "Next.js",
        "confidence": 95,
        "version": "13.0.0",
        "icon": "https://www.wappalyzer.com/images/icons/Next.js.svg",
        "website": "https://nextjs.org",
        "categories": [
          {
            "id": 18,
            "slug": "web-frameworks",
            "name": "Web frameworks"
          }
        ]
      }
    ],
    "totalTechnologies": 15,
    "analysisTime": 1250
  }
}
```

**Response (erreur):**
```json
{
  "success": false,
  "error": "URL invalide"
}
```

## 🔧 Fonctionnalités

### ✅ Détection avancée
- **35+ catégories** de technologies supportées
- **Niveaux de confiance** pour chaque détection
- **Versions** des technologies détectées
- **Icônes et liens** vers les sites officiels

### ✅ Sécurité
- Validation stricte des URLs
- Blocage des adresses internes (localhost, IP privées)
- Gestion des erreurs et timeouts
- Clé API sécurisée (côté serveur uniquement)

### ✅ Performance
- Timeout de 30 secondes
- Gestion des limites de taux API
- Interface responsive et animations fluides
- Statistiques de performance affichées

### ✅ Expérience utilisateur
- Interface moderne et intuitive
- Groupement par catégories
- Codes couleur selon la confiance
- Messages d'erreur détaillés
- Mode debug avec statistiques

## 🧪 Tests

Testez l'API avec le script fourni :

```bash
node test-wappalyzer-api.mjs
```

Ou testez directement avec curl :

```bash
curl -X POST http://localhost:3000/api/tech-analyzer \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://nextjs.org"}'
```

## 📊 Exemples de détection

- **Next.js** : Framework, versions, optimisations
- **React** : Bibliothèque, composants, hooks
- **Tailwind CSS** : Framework CSS, classes utilitaires
- **Vercel** : Plateforme d'hébergement
- **Google Analytics** : Outils d'analyse
- **WordPress** : CMS, plugins, thèmes

## ⚠️ Limites et considérations

1. **Limites API** : Respectez les limites de votre plan Wappalyzer
2. **Timeout** : Sites lents ou inaccessibles peuvent échouer
3. **Détection** : Certaines technologies peuvent ne pas être détectées si elles sont obfusquées
4. **Coût** : L'API Wappalyzer est payante au-delà du quota gratuit

## 🔗 Liens utiles

- [API Wappalyzer](https://www.wappalyzer.com/api/)
- [Documentation Next.js](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
