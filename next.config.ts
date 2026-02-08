import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/drumy",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
