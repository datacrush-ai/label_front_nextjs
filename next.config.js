/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL
  },
  swcMinify: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: '/uuid',
  //       destination: '/',
  //     },
  //   ]
  // },
  // async redirects() {
  //   return [
  //     {
  //       source: '/uuid/*',
  //       has: [
  //         {
  //           type: 'header',
  //           key: 'x-nia-user-id',
  //         }
  //       ],
  //       destination: '/',
  //       permanent: true,
  //     },
  //   ]
  // },
  // async headers() {
  //   return [
  //     {
  //       source: '/uuid/:uuid*',
  //       has: [
  //         {
  //           type: 'header',
  //           key: 'x-nia-user-id',
  //         }
  //       ],
  //       headers: [
  //         {
  //           key: 'x-nia-user-id',
  //           value: ':uuid*',
  //         },
  //       ]
  //     },
  //   ]
  // },
}

module.exports = nextConfig
