import Link from 'next/link';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 transition-opacity hover:opacity-80"
      aria-label="NR4 NINJAS Home"
    >
      <span className="text-2xl font-headline text-primary" aria-hidden="true">
        🥷
      </span>
      <span className="font-headline text-xl tracking-wider uppercase">
        NR4 NINJAS
      </span>
    </Link>
  );
}
