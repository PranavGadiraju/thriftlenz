/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fonts are requested by the browser at runtime, so the build stays network-free.
  optimizeFonts: false,
  images: {
    // Remote catalogue photos are served directly so Vercel does not need to optimise them.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
        pathname: "/**",
      },
    ],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
