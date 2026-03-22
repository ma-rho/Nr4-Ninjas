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

export function PhotoGallery({ photos, loading }: PhotoGalleryProps) {
  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <Loader2 className="animate-spin text-primary" size={48} />
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
        <div key={photo.id} className="photo-grid-item relative overflow-hidden rounded-lg shadow-lg group">
          <Image 
            src={photo.url} 
            alt="Gallery photo" 
            fill
            // Optimization: Tells Next.js to serve smaller images.
            // Since some items span 2 columns/rows in your CSS, 
            // we provide a generous range to maintain quality.
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // Priority for top images to improve initial load speed
            priority={index < 6}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}