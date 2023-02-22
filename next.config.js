/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  env: {
    BASE_URL: process.env.BASE_URL,
  },
  images: {
    loader: "imgix",
    path: "",
  },
  appDir: true,

}

module.exports = nextConfig
