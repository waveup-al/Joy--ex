import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Tắt tối ưu hóa cho ảnh từ FAL AI để giữ nguyên chất lượng gốc
    unoptimized: false,
    // Cấu hình domains được phép
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.fal.media',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.utfs.io',
        port: '',
        pathname: '/**',
      }
    ],
    // Cấu hình loader tùy chỉnh cho FAL images
    loader: 'default',
    // Tăng kích thước tối đa cho phép
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 1024, 2048],
  },
};

export default nextConfig;
