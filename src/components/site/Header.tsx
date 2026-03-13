'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useState } from 'react';

import { Logo } from '@/components/site/Logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { CartIcon } from './CartIcon';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

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
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  async function handleLogout() {
    try {
      await auth.signOut();
      router.push('/');
      closeSheet();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  }

  const closeSheet = () => setIsSheetOpen(false);

  const NavLink = ({
    href,
    label,
    isMobile = false,
    onClick,
  }: {
    href: string;
    label: string;
    isMobile?: boolean;
    onClick?: () => void;
  }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={onClick}
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
          <NavLink href="/admin" label="Dashboard" isMobile={isMobile} onClick={closeSheet} />
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

    return <NavLink href="/admin/login" label="Admin" isMobile={isMobile} onClick={closeSheet} />;
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
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <VisuallyHidden>
                  <SheetTitle>Mobile Menu</SheetTitle>
                  <SheetDescription>Navigation links for the website</SheetDescription>
                </VisuallyHidden>
                <div className="p-4">
                  <Logo />
                  <nav className="mt-8 flex flex-col space-y-2">
                    {navLinks.map((link) => (
                      <NavLink key={link.href} {...link} isMobile onClick={closeSheet} />
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