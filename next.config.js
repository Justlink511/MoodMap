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
  },
  // Configuration pour les ressources statiques
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: '/MoodMap/_next/static/media/',
          outputPath: 'static/media/',
          name: '[name].[hash].[ext]',
        },
      },
    });
    return config;
  },
}

module.exports = nextConfig 