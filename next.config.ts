import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'puppeteer',
    'puppeteer-core',
    '@sparticuz/chromium',
    'lighthouse',
    'chrome-launcher'
  ],
  webpack: (config: any) => {
    // Handle dynamic imports for Lighthouse
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      child_process: false,
    };
    
    return config;
  },
};

export default nextConfig;
