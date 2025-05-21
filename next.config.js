/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for GitHub Pages
  // Note: When using middleware with static export, you need to handle middleware differently
  // For local development, comment out 'output: export' to test middleware functionality
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://beenycool-github-io.onrender.com/api',
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