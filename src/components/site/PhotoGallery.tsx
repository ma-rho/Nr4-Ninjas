'use client';

import Masonry from 'react-masonry-css';

interface Photo {
  id: string;
  url: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

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
