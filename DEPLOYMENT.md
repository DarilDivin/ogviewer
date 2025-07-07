# 🚀 Deployment Guide

## Environment Variables Setup

### Required for Production

1. **Google PageSpeed Insights API Key**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the PageSpeed Insights API
   - Create an API key
   - Add to your environment: `PAGESPEED_API_KEY=your_key_here`

### Optional for Enhanced Features

2. **Screenshot API Key** (for production screenshots)
   - Sign up at [ScreenshotOne](https://screenshotone.com/)
   - Get your API key
   - Add to your environment: `SCREENSHOT_API_KEY=your_key_here`

3. **Wappalyzer API Key** (for enhanced technology detection)
   - Sign up at [Wappalyzer](https://www.wappalyzer.com/api/)
   - Get your API key
   - Add to your environment: `WAPPALYZER_API_KEY=your_key_here`

## Local Development

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your API keys in `.env.local`

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

## Production Deployment

### Vercel (Recommended)

1. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings
   - Add the environment variables:
     - `PAGESPEED_API_KEY`
     - `SCREENSHOT_API_KEY` (optional)
     - `WAPPALYZER_API_KEY` (optional)

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Other Platforms

For deployment on other platforms (Netlify, Railway, Render, etc.):

1. Set the same environment variables in your platform's settings
2. Ensure Node.js 18+ is used
3. Build command: `pnpm build`
4. Start command: `pnpm start`

## Features

### ✅ Production-Ready Features

- **PageSpeed Insights Integration**: Uses Google's official API (serverless-compatible)
- **Technology Detection**: Advanced technology stack analysis
- **SEO Analysis**: Comprehensive SEO audit
- **Modern UI**: Shadcn/UI with dark mode support
- **Responsive Design**: Works on all devices
- **Screenshot Capture**: Conditional implementation for local/production

### 🔧 Performance Optimizations

- **Serverless Compatible**: No Chrome/Puppeteer dependencies in production
- **API Caching**: Efficient data fetching
- **Error Handling**: Graceful degradation
- **Build Optimizations**: ESLint/TypeScript warnings ignored for production builds

## API Endpoints

- `GET /api/metadata?url={url}&analysis={type}` - Main analysis endpoint
  - `analysis` types: `basic`, `seo`, `tech`, `performance`, `full`
- `POST /api/metadata?url={url}` - Screenshot capture
- `GET /api/tech-analyzer?url={url}` - Technology detection only

## Troubleshooting

### Common Issues

1. **PageSpeed API Quota Exceeded**
   - Check your Google Cloud Console quotas
   - Consider implementing rate limiting

2. **Screenshot Fails in Production**
   - Verify SCREENSHOT_API_KEY is set
   - Check ScreenshotOne API limits

3. **Build Errors**
   - The build ignores TypeScript/ESLint errors by default
   - Fix critical errors manually if needed

4. **Technology Detection Issues**
   - Ensure target website is publicly accessible
   - Check for CORS or firewall restrictions

### Debug Mode

Set `NODE_ENV=development` for detailed error logging.

## License

MIT License - feel free to use this for your projects!
