import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.bber.unm.edu",
        port: "",
        pathname: "/api/files/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "api.bber.unm.edu",
        port: "",
        pathname: "/uploads/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
