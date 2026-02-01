import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center transition-opacity hover:opacity-80"
      aria-label="NR4 NINJAS Home"
    >
      <Image
        src="/logo.png"
        alt="NR4 NINJAS Logo"
        width={120}
        height={40}
        className="h-10 w-auto"
        priority
      />
    </Link>
  );
}
