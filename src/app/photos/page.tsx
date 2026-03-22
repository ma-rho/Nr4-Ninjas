import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PhotoGallery } from '@/components/site/PhotoGallery';

async function getPhotos() {
  const photosCollection = collection(db, 'photos');
  const q = query(photosCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  // Transform the complex Firestore object into a plain serializable object
  const photos = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      url: data.url,
      // Convert Timestamp to a plain ISO string or milliseconds
      createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate().toISOString() : null 
    };
  });
  
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