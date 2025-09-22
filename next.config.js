/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'yufkhkayhpmgpszsnyab.supabase.co',
        port: '',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
