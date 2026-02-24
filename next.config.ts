import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@node-rs/argon2", "@node-rs/bcrypt"],
};

export default nextConfig;
