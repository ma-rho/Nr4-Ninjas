import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  src?: string;
}

export function Logo({ src = "/logo.png" }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center transition-opacity hover:opacity-80"
      aria-label="Home"
    >
      <div className="relative">
        <Image
          src={src}
          alt="Logo"
          width={180}
          height={60}
          className="h-12 w-auto object-contain"
          priority
        />
      </div>
    </Link>
  );
}
