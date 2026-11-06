/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

let exportedConfig = nextConfig;

if (process.env.ANALYZE === "true") {
  try {
    const bundleAnalyzer = (await import("@next/bundle-analyzer")).default;
    exportedConfig = bundleAnalyzer({ enabled: true })(nextConfig);
  } catch (e) {
    console.warn("@next/bundle-analyzer not found, skipping analysis.");
  }
}

export default exportedConfig;
