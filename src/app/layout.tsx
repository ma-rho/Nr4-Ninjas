import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { PayPalProvider } from '@/components/site/PayPalProvider';

export const metadata: Metadata = {
  title: 'NR4 NINJAS | A live story.',
  description:
    'High quality urban and Black events in the South / South East of England. Norwich, Colchester, London & beyond. #nr4ninjas',
};

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
        <PayPalProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </AuthProvider>
        </PayPalProvider>
      </body>
    </html>
  );
}
