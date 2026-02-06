import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  src?: string;
}

export function Logo({ src = "/logo.PNG" }: LogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center transition-opacity hover:opacity-80"
      aria-label="NR4 NINJAS Home"
    >
      <div className="relative">
        <Image
          src={src}
          alt="NR4 NINJAS Logo"
          width={240}
          height={80}
          className="h-20 w-auto mix-blend-lighten"
          priority
        />
      </div>
    </Link>
  );
}
