/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'codante-mp-foto-upload.s3.sa-east-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
