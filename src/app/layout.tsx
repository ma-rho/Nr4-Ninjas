import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NR4 NINJAS | A live story.',
  description:
    'High quality urban and Black events in the South / South East of England. Norwich, Colchester, London & beyond. #nr4ninjas',
};

// Set this to true to enable the downtime page
const isDowntime = false;

const DowntimePage = () => (
  <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background overflow-hidden selection:bg-primary selection:text-white">
    {/* Emoji Background Layer */}
    <div className="absolute inset-0 opacity-10 pointer-events-none select-none flex flex-wrap justify-around content-around p-4 text-4xl">
      {Array.from({ length: 150 }).map((_, i) => (
        <span key={i} className="animate-pulse" style={{ animationDelay: `${(i % 5) * 0.5}s` }}>
          😀
        </span>
      ))}
    </div>
    
    {/* Main Content */}
    <div className="relative z-10 text-center px-4">
      <h1 className="font-headline text-6xl md:text-9xl uppercase text-primary tracking-tighter drop-shadow-2xl">
        REACH MARZ
      </h1>
      <div className="mt-8">
        <Link
          href="https://marzplace.com"
          target="_blank"
          className="font-body text-xl md:text-2xl uppercase tracking-[0.3em] border-b-2 border-primary pb-1 hover:text-primary transition-all duration-300"
        >
          marzplace.com
        </Link>
      </div>
    </div>
  </div>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Ultra&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning={true}>
        {isDowntime && <DowntimePage />}
        <CartProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
