import { Instagram, Mail } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/site/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.7-2.9-1.31-1.31-2.13-3.1-2.24-4.95-.02-.34-.01-.68-.01-1.02.03-2.33.01-4.66.01-6.99.02-1.51.56-2.99 1.66-4.06 1.12-1.08 2.7-1.61 4.22-1.78v4.02c-1.45.05-2.9.34-4.21.97-.57.26-1.1.59-1.62.93v8.77c.02.01.03.03.05.04.53.2 1.08.31 1.64.38.83.09 1.67.06 2.5-.09.89-.16 1.75-.48 2.53-.97s1.42-1.13 1.88-1.91.71-1.67.73-2.59v-8.62c.03-1.5.63-2.96 1.73-4.04 1.1-1.08 2.66-1.62 4.2-1.78Z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-secondary">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-4 text-center text-sm text-muted-foreground md:text-left">
              A live story. #nr4ninjas
            </p>
            <div className="mt-4 flex space-x-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link
                  href="https://www.instagram.com/nr4_ninjas"
                  target="_blank"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link
                  href="https://www.tiktok.com/@nr4.ninjas"
                  target="_blank"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-primary"
              >
                <Link
                  href="mailto:Nr4ninjas@gmail.com"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="font-headline text-lg uppercase">Newsletter</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Get the latest on events & merch drops.
                </p>
                <form className="mt-4 flex w-full max-w-sm space-x-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="flex-1"
                    aria-label="Email for newsletter"
                  />
                  <Button type="submit">Subscribe</Button>
                </form>
              </div>
              <div className="sm:text-right">
                <h3 className="font-headline text-lg uppercase">Contact</h3>
                <a
                  href="mailto:Nr4ninjas@gmail.com"
                  className="mt-2 inline-block text-sm text-muted-foreground hover:text-primary"
                >
                  Nr4ninjas@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-4 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} NR4 NINJAS. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
