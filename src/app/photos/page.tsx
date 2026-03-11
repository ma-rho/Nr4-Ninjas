import { PhotoGallery } from '@/components/site/PhotoGallery';
import { getPhotos } from '@/app/actions/photos';

export default async function PhotosPage() {
  const photos = await getPhotos();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Photo Gallery📸</h1>
      <PhotoGallery photos={photos} />
    </div>
  );
}
