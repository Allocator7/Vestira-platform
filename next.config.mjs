/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
    }
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // AWS Amplify deployment settings
  trailingSlash: false,
  // Disable static export for Amplify
  output: undefined,
  // Fix routing for Amplify
  async rewrites() {
    return [
      {
        source: '/(.*)',
        destination: '/index.html',
      },
    ]
  },
}

export default nextConfig
