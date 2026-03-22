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
      {photos.map((photo) => (
        <div key={photo.id} className="photo-grid-item">
          <Image 
            src={photo.url} 
            alt="Photo from gallery" 
            width={800} // Base width for Next.js Image optimization
            height={800} // Base height for Next.js Image optimization
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      ))}
    </div>
  );
}
