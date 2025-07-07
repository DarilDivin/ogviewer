# 🔍 OGViewer - Analyseur de Site Web

Application Next.js 15 pour analyser les métadonnées, SEO, performances et technologies des sites web **sans dépendances API externes**.

## ✅ Fonctionnalités disponibles

### 📊 **Analyse des métadonnées**
- Titre, description, image de prévisualisation
- Favicon et URL canonique
- Compatible Open Graph et Twitter Cards

### � **Analyse SEO**
- Score SEO global
- Vérification des balises meta
- Analyse de la structure HTML
- Recommandations d'amélioration

### ⚡ **Analyse de performance**
- Métriques Lighthouse (LCP, FID, CLS, etc.)
- Temps de chargement
- Optimisations suggérées
- Fallback vers analyse basique si Lighthouse échoue

### 🛠️ **Détection de technologies**
- **35+ patterns de détection** pour les technologies populaires
- **Frameworks** : Next.js, React, Vue.js, Angular, Svelte
- **CSS** : Tailwind CSS, Bootstrap, Bulma
- **Analytics** : Google Analytics, Tag Manager, Facebook Pixel
- **CDN** : Cloudflare, jsDelivr, unpkg
- **Bibliothèques** : jQuery, Lodash, Axios, Three.js
- **Hébergement** : Vercel, Netlify, GitHub Pages
- **CMS** : WordPress, Drupal, Joomla
- **E-commerce** : Shopify, WooCommerce

### 🎯 **Avantages du système local**
- ✅ **Aucune clé API requise**
- ✅ **Gratuit et illimité**
- ✅ **Logique anti-faux-positifs** (pas d'Angular détecté sur un site Next.js)
- ✅ **Scores de confiance** calculés selon le nombre de patterns matchés
- ✅ **Statistiques détaillées** (temps de détection, taille HTML, patterns vérifiés)
- ✅ **Détection multicouche** : HTML + en-têtes HTTP + patterns spécialisés
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
