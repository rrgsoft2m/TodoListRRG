/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXT_PUBLIC_API_URL: 'https://todolist-api-860x.onrender.com/api',
    },
}

module.exports = nextConfig
