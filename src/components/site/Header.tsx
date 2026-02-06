'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';

import { Logo } from '@/components/site/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { CartIcon } from './CartIcon';

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/djs', label: 'DJs' },
  { href: '/shop', label: 'Shop' },
  { href: '/photos', label: 'Photos' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  async function handleLogout() {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  const NavLink = ({
    href,
    label,
    isMobile = false,
  }: {
    href: string;
    label: string;
    isMobile?: boolean;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={cn(
          'font-body uppercase tracking-widest transition-colors',
          isActive ? 'text-primary' : 'hover:text-primary/80',
          isMobile ? 'block p-4 text-lg' : 'text-sm'
        )}
      >
        {label}
      </Link>
    );
  };

  const AuthNav = ({ isMobile = false }) => {
    if (loading) return null;

    if (user) {
      return (
        <>
          <NavLink href="/admin" label="Dashboard" isMobile={isMobile} />
          <Button
            onClick={handleLogout}
            variant="ghost"
            className={cn(
              'font-body uppercase tracking-widest transition-colors',
              isMobile ? 'block p-4 text-lg text-left w-full' : 'text-sm'
            )}
          >
            Logout
          </Button>
        </>
      );
    }

    return <NavLink href="/admin/login" label="Admin" isMobile={isMobile} />;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo src="/logo.PNG" />

        <div className="flex items-center gap-4">
          <nav className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <AuthNav />
          </nav>

          <CartIcon />

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="p-4">
                  <Logo />
                  <nav className="mt-8 flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} {...link} isMobile />
                    ))}
                    <AuthNav isMobile />
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
