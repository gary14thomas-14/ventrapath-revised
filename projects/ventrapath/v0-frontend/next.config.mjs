/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL ?? (process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:4000' : '')

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (!backendUrl) {
      return []
    }

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
