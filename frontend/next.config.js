/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Proxy API requests to FastAPI backend during development
  async rewrites() {
    // Only proxy in development (when NEXT_PUBLIC_API_URL is not set)
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/api/:path*',
        },
      ];
    }
    // In production, Vercel will route /api/* to the FastAPI backend via vercel.json
    return [];
  },
};

module.exports = nextConfig;

