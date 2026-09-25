import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The hand-built /practice activities retired into Lesson mode. Query
  // strings (lang, mode) carry through.
  async redirects() {
    return [
      { source: "/practice/password", destination: "/lessons/account-recovery", permanent: false },
      { source: "/practice/assignment", destination: "/lessons/coursework", permanent: false },
      { source: "/practice/:path*", destination: "/lessons", permanent: false },
      { source: "/practice", destination: "/lessons", permanent: false },
    ];
  },
};

export default nextConfig;
