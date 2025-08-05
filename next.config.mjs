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
  // Enable static export for Amplify
  output: 'export',
  // Disable server-side features for static export
  experimental: {
    ...nextConfig.experimental,
    appDir: true,
  },
}

export default nextConfig
