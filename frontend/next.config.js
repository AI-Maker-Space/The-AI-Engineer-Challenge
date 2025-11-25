/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'https://the-ai-engineer-challenge-backend-rho.vercel.app',
  },
}

module.exports = nextConfig
