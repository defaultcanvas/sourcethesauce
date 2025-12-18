/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable Next.js image optimization to avoid Vercel OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hagyhubbgaklzxyzmazf.supabase.co',
        pathname: '/storage/**',
      },
    ],
  }
}

module.exports = nextConfig
