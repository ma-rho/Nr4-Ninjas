import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         {
  //           key: 'Content-Security-Policy',
  //           value: [
  //             "default-src 'self';",
  //             "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.paypal.com https://www.sandbox.paypal.com https://*.paypalobjects.com;",
  //             "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.paypal.com https://www.sandbox.paypal.com;",
  //             "font-src 'self' https://fonts.gstatic.com;",
  //             // Allow media (audio/video) from Firebase Storage
  //             "media-src 'self' https://firebasestorage.googleapis.com;",
  //             "connect-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://api-m.sandbox.paypal.com https://*.googleapis.com https://us-central1-nr4-9c722.cloudfunctions.net wss://*.firebaseio.com;",
  //             "frame-src 'self' https://www.paypal.com https://www.sandbox.paypal.com https://*.google.com;",
  //             "img-src 'self' data: https://*.paypalobjects.com https://images.unsplash.com https://firebasestorage.googleapis.com https://placehold.co https://picsum.photos;",
  //           ].join(' '),
  //         },
  //         {
  //           key: 'Referrer-Policy',
  //           value: 'origin-when-cross-origin',
  //         },
  //       ],
  //     },
  //   ];
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'firebasestorage.googleapis.com',
      //   pathname: '/v0/b/nr4-9c722.appspot.com/o/**',
      // },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/nr4-9c722.firebasestorage.app/o/**',
      },
    ],
  },
};

export default nextConfig;