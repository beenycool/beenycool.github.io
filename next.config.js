/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  // GitHub Pages with username.github.io should be served from root, not a subfolder
  basePath: '',
  assetPrefix: ''
}

module.exports = nextConfig 