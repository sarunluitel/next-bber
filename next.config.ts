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
    ],
  },
};

export default nextConfig;
