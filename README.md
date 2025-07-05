# OGViewer - Analyseur de Site Web Avancé

Un outil d'analyse de sites web développé avec Next.js qui permet d'extraire les métadonnées, d'analyser le SEO, de détecter les technologies utilisées et d'évaluer les performances.

## 🚀 Fonctionnalités

### 📊 Analyse de base
- Extraction des métadonnées (titre, description, image Open Graph)
- Capture d'écran automatique
- URL canonique et favicon

### 📈 Analyse SEO
- Score SEO global sur 100 points
- Analyse des balises titre et meta description
- Vérification de la structure des titres (H1, H2, H3)
- Contrôle des attributs alt des images
- Analyse des liens internes et externes
- Recommandations personnalisées

### ⚛️ Détection de technologies
- Frameworks JavaScript (React, Vue, Angular, Next.js, etc.)
- CMS (WordPress, Drupal, Joomla, etc.)
- Outils d'analytics (Google Analytics, Hotjar, etc.)
- Bibliothèques et frameworks CSS
- CDN utilisés
- Serveurs web et langages de programmation

### ⚡ Analyse de performance
- Score de performance Lighthouse
- Core Web Vitals (LCP, FID, CLS)
- Métriques de vitesse (FCP, Speed Index, TTI)
- Analyse de la taille des ressources
- Opportunités d'amélioration

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : TailwindCSS avec animations (Motion)
- **Backend** : API Routes Next.js
- **Web Scraping** : Cheerio, Axios
- **Performance** : Lighthouse, Chrome Launcher
- **Screenshots** : Puppeteer
- **Validation** : Validator.js

## 📦 Installation

```bash
# Cloner le repository
git clone <repository-url>
cd ogviewer

# Installer les dépendances
pnpm install

# Lancer en mode développement
pnpm dev

# Construire pour la production
pnpm build
pnpm start
```

## 🔧 Types d'analyse disponibles

1. **Analyse de base** : Métadonnées + capture d'écran
2. **SEO** : Analyse SEO complète
3. **Technologies** : Détection des technologies utilisées
4. **Performance** : Analyse de performance Lighthouse
5. **Analyse complète** : Toutes les analyses combinées

## 📋 API Endpoints

### GET /api/metadata
Analyse les métadonnées d'une URL donnée.

**Paramètres :**
- `url` (required) : L'URL à analyser
- `analysis` (optional) : Type d'analyse (`basic`, `seo`, `tech`, `performance`, `full`)

**Exemple :**
```
GET /api/metadata?url=https://example.com&analysis=seo
```

### POST /api/metadata
Capture une screenshot de l'URL donnée.

**Paramètres :**
- `url` (required) : L'URL à capturer

## 🔒 Sécurité

- Validation stricte des URLs
- Blocage des adresses internes (localhost, 127.0.0.1)
- Timeout configurable pour les requêtes
- Gestion des erreurs robuste

## 🚀 Fonctionnalités futures

- Historique des analyses
- Comparaison entre sites
- Export PDF/CSV
- Analyse en lot
- Monitoring continu
- API webhooks

## 📄 Licence

MIT License

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Développé avec ❤️ et Next.js
