/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        scrollRestoration: true,
    },
    images: {
        domains: ["lh3.googleusercontent.com", "images.unsplash.com"],
    },
};

module.exports = nextConfig
