import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@base-ui/react"],
  },
};

export default nextConfig;
