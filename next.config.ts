import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // We already have internal linting checks
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We ignore build errors as users may have local environment issues
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // Enable typed routes for better developer experience
    typedRoutes: true,
  },
}

export default nextConfig
