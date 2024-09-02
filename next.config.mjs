/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Danger: Disabling type checking can lead to runtime errors
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

