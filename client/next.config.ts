import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/api-docs/:path*', destination: 'http://localhost:3000/api-docs/:path*' },
      { source: '/api-docs', destination: 'http://localhost:3000/api-docs/' },
      { source: '/swagger.json', destination: 'http://localhost:3000/swagger.json' }
    ];
  }
};

export default nextConfig;
