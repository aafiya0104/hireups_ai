import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // On slow filesystems (network drives / aggressive antivirus),
    // Turbopack cache compaction can dominate route compile time.
    turbopackFileSystemCacheForDev: false,
  },
};

export default nextConfig;
