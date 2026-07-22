/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      { protocol: "https", hostname: "loremflickr.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ebayimg.com", pathname: "/**" },
      { protocol: "https", hostname: "thumbs.ebaystatic.com", pathname: "/**" },
    ],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
