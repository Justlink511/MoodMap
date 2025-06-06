/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/MoodMap',
  assetPrefix: '/MoodMap/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Désactiver certaines optimisations pour le déploiement statique
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  // Forcer le mode statique
  experimental: {
    appDir: false,
  }
}

module.exports = nextConfig 