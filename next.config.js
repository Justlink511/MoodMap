/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/mood-map',
  assetPrefix: '/mood-map/',
  trailingSlash: true,
}

module.exports = nextConfig 