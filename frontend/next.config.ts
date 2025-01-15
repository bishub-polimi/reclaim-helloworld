import type { NextConfig } from "next";

const isGitHubPages = process.env.IS_GITHUB_PAGES ?  process.env.IS_GITHUB_PAGES : "false";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGitHubPages == "true" ? '/reclaim-helloworld' : '',
  assetPrefix: isGitHubPages == "true" ? '/reclaim-helloworld/' : '',
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
