/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './image-loader.js',
  },
  basePath: '/mood-map',
  assetPrefix: '/mood-map/',
  trailingSlash: true,
  distDir: 'out',
  poweredByHeader: false,
}

module.exports = nextConfig 