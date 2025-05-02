/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ai-gcse-marker',
  assetPrefix: '/ai-gcse-marker/',
  publicRuntimeConfig: {
    openRouterApiKey: process.env.OPENROUTER_API_KEY || ''
  }
}

module.exports = nextConfig
