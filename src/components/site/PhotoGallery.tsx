'use client';

import Masonry from 'react-masonry-css';
import { Loader2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  loading: boolean;
}

export function PhotoGallery({ photos, loading }: PhotoGalleryProps) {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

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
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {photos.map((photo) => (
        <div key={photo.id} className="photo-item">
          <img 
            src={photo.url} 
            alt="Photo from gallery" 
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      ))}
    </Masonry>
  );
}
