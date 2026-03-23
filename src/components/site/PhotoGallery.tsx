'use client';

import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  loading?: boolean;
}

// A minimal, transparent GIF for the blurDataURL
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str)

export function PhotoGallery({ photos, loading }: PhotoGalleryProps) {

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center mt-20">
        <p className="font-headline text-4xl uppercase text-primary">
          More photos coming soon...
        </p>
      </div>
    );
  }

  return (
    <div className="photo-grid">
      {photos.map((photo, index) => (
        <div key={photo.id} className="photo-grid-item relative overflow-hidden rounded-lg shadow-lg group bg-white/5">
          <Image 
            src={photo.url} 
            alt="Gallery photo" 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
            priority={index < 4} // Improves LCP for the first few images
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
          />
        </div>
      ))}
    </div>
  );
}
