/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      'localhost',
      'ashley-api.herokuapp.com'
    ],
  },

  async redirects() {
    return [{
      source: '/',
      destination: '/login',
      permanent: true,
    }]
  }
}

module.exports = nextConfig
