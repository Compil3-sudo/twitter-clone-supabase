/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tkucuunzwysyuqynjhwt.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
