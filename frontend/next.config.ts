import type { NextConfig } from "next";

const isGitHubPages = process.env.IS_GITHUB_PAGES ?  true : false;

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGitHubPages ? '/reclaim-helloworld' : '',
  assetPrefix: isGitHubPages ? '/reclaim-helloworld/' : '',
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
