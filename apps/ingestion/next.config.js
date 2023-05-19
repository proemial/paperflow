/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['data', 'utils', 'ui'],
}

module.exports = nextConfig
