import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['s3-media0.fl.yelpcdn.com'],
  },
};

export default nextConfig;
