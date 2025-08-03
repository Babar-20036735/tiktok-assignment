import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // Increase body size limit for video uploads
    },
  },
};

export default nextConfig;
