/** @type {import('next').NextConfig} */
const isStaticExport = process.env.IS_STATIC_EXPORT === 'true';
const nextConfig = {
  reactStrictMode: true,
  // Use static export only when IS_STATIC_EXPORT=true
  ...(isStaticExport ? { output: 'export' } : {}),
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
  },
  // Override headers to remove default Permissions-Policy header for all routes
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Permissions-Policy',
  //           value: '' // Setting to empty effectively removes it or sets a minimal non-blocking policy
  //         }
  //       ]
  //     }
  //   ];
  // }
}

module.exports = nextConfig; 