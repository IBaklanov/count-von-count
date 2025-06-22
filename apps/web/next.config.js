/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@count-von-count/shared'],
  experimental: {
    appDir: false,
  },
}

module.exports = nextConfig
