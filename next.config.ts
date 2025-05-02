/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  publicRuntimeConfig: {
    openRouterApiKey: process.env.OPENROUTER_API_KEY || ''
  }
}

module.exports = nextConfig
