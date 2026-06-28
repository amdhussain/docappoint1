/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'img.freepik.com',
      'randomuser.me',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/auth',
        destination: 'http://localhost:5000/api/auth',
      },
      {
        source: '/api/:slug*',
        destination: 'http://localhost:5000/api/:slug*',
      },
    ];
  },
};

module.exports = nextConfig;
