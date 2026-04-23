import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // ATTENTION : Dans les nouvelles versions, c'est directement à la racine, 
  // pas dans "experimental"
  allowedDevOrigins: ["drizzle-tainted-muppet.ngrok-free.dev"],
} as any;

export default nextConfig;