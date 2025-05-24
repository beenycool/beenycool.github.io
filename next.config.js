/** @type {import('next').NextConfig} */
const isStaticExport = process.env.IS_STATIC_EXPORT === 'true';
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  // Use static export only when IS_STATIC_EXPORT=true
  ...(isStaticExport ? { 
    output: 'export',
    images: { unoptimized: true }
  } : {}),
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  env: {
    // Use environment variables or default values
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://beenycool-github-io.onrender.com',
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
  },
  webpack: (config, { dev, isServer }) => {
    // Add optimization settings
    if (!dev && !isServer) {
      config.optimization.minimize = false;
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000
      };
    }

    // Add React alias to ensure all components use the same React instance
    const reactPath = path.dirname(require.resolve('react/package.json'));
    config.resolve.alias = {
      ...config.resolve.alias,
      'react': reactPath,
      'react-dom': path.dirname(require.resolve('react-dom/package.json')),
      'react/jsx-runtime': path.join(reactPath, 'jsx-runtime')
    };
    
    return config;
  },
  // Remove experimental settings that may cause issues with static builds
  experimental: {},
  
  // For App Router, we need to explicitly handle route generation
  // This excludes API routes and dynamic routes
  staticPageGenerationTimeout: 300,
}

module.exports = nextConfig; 