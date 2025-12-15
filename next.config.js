/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove deprecated options
  swcMinify: true,
  images: {
    domains: ['api.open-meteo.com'],
  },
}

module.exports = nextConfig