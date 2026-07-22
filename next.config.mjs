/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Fonts are requested by the browser at runtime, so the build stays network-free.
  optimizeFonts: false,
  images: {
    // Catalogue art is local vector artwork; it needs no raster optimisation.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
