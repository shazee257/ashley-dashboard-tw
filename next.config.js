/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // swcMinify: true,
  images: {
    domains: [
      'localhost',
      'ashley-api.herokuapp.com'
    ],
  },
}

module.exports = nextConfig
