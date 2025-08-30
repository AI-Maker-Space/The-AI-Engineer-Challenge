/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  async rewrites() {
    // During local dev, proxy frontend /api/* to the FastAPI server if running locally
    // In Vercel, the top-level vercel.json routes handle this
    return process.env.NEXT_PUBLIC_LOCAL_API === 'true'
      ? [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/api/:path*'
          }
        ]
      : []
  }
}

export default nextConfig


