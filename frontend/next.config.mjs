/** @type {import('next').NextConfig} */
const nextConfig = {
    allowedDevOrigins: ['192.168.5.68'],
    experimental: {
        serverActions: {
            bodySizeLimit: '5mb',
        },
    },
}

export default nextConfig