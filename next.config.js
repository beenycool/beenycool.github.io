/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: {
    unoptimized: true
  },
  basePath: '',
  assetPrefix: '',
  env: {
    NEXT_PUBLIC_API_BASE_URL: 'https://beenycool-github-io.onrender.com',
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