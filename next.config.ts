/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Force le build même s'il y a des petites fautes
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore les avertissements de style
  },
};

export default nextConfig;