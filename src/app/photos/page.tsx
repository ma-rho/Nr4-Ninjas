import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PhotoGallery } from '@/components/site/PhotoGallery';

async function getPhotos() {
  const photosCollection = collection(db, 'photos');
  const q = query(photosCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const photos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; url: string; createdAt: string }[];
  return photos;
}

export default async function PhotosPage() {
  const photos = await getPhotos();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Photo Gallery📸</h1>
      <PhotoGallery photos={photos} />
    </div>
  );
}
