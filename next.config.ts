import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Évite que Next.js remonte par erreur vers /Users/thomas (qui contient un
  // package-lock.json sans rapport) lors de la résolution du monorepo/workspace.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
