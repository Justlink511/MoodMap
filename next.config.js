/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/mood-map',
  assetPrefix: '/mood-map/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  experimental: {
    appDir: false,
  }
}

module.exports = nextConfig 