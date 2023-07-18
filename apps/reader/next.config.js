/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["ui", "utils"],
    experimental: {
        serverActions: true
    },
}

module.exports = nextConfig
