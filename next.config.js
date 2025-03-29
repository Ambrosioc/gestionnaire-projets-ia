/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  i18n: {
    locales: ['en', 'fr'], 
    defaultLocale: 'fr', 
  },
};

module.exports = nextConfig;
