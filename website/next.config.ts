import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/pomodoro-habit', // Assuming repo name is pomodoro-habit
  reactCompiler: true,
};

export default nextConfig;
