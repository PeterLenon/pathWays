/** @type {import('next').NextConfig} */
const nextConfig = {
  // "standalone" produces a self-contained server bundle required by the Docker
  // multi-stage build. It is gated behind DOCKER_BUILD=1 because the @vercel/nft
  // trace-collection step it triggers hits macOS XProtect timeouts on local builds.
  // Docker builds run on Linux where XProtect is absent, so they always succeed.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" } : {}),

  // macOS security-scans node_modules JS files on first access. next/dist/build/utils
  // alone takes 110s on a cold cache. 300s gives safe headroom for all workers.
  // This setting is a no-op on Linux (Docker builds are instant).
  staticPageGenerationTimeout: 300,

  experimental: {
    // Limit parallel webpack workers to reduce peak memory during builds.
    cpus: 2,
  },
};
export default nextConfig;
