/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For unified server, we don't need static export anymore
  // output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  env: {
    // Use environment variables or default values
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
  },
  webpack: (config, { dev, isServer }) => {
    // Add optimization settings
    if (!dev && !isServer) {
      config.optimization.minimize = true;
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000
      };
    }
    return config;
  },
  // Use React server-components condition to avoid duplicate React issues
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig; 