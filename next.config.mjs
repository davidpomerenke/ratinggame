/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.ltrbxd.com',
      },
    ],
  },
};

export default nextConfig;
