import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['canvas', '@napi-rs/canvas', 'pdf-parse', '@react-pdf/renderer'],
  turbopack: {},
};

export default nextConfig;
