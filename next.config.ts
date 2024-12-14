import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  images: {
    domains: ['calskgne.legacyestate.uz'], // Ensure this domain is added
    minimumCacheTTL: 60, // Cache images for 60 seconds
  },
};

export default nextConfig;
