/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'production'
          ? 'https://your-production-api-url.com/api/:path*'  // Replace with your production API URL
          : 'http://localhost:8000/api/:path*',
      },
    ]
  },
  // Enable static optimization
  output: 'standalone',
}

module.exports = nextConfig 