/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/mainpage',
        permanent: true,
      },
    ]
  }
}

module.exports = nextConfig
