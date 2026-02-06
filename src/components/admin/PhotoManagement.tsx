'use client';

import { PhotoForm } from '@/components/admin/PhotoForm';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';

async function getPhotos() {
  const photosCollection = collection(db, 'photos');
  const photoSnapshot = await getDocs(photosCollection);
  const photos = photoSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return photos;
}

export function PhotoManagement() {
  const [photos, setPhotos] = useState<any[]>([]);
  const router = useRouter();

  const loadPhotos = async () => {
    const photosFromServer = await getPhotos();
    setPhotos(photosFromServer);
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, 'photos', id));
      setPhotos(photos.filter((photo) => photo.id !== id));
      router.refresh();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
            <Camera className="text-vibe-blue" />
            <h2 className="text-xl font-black uppercase tracking-widest italic">Photo Gallery</h2>
        </div>
        <PhotoForm onPhotoAdded={loadPhotos} />
        <div className="mt-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 italic">Uploaded Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {photos.map((photo: any) => (
                <div key={photo.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10">
                  <Image
                    src={photo.url}
                    alt="Gallery photo"
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => { if(confirm("Delete this photo?")) handleDelete(photo.id) }}
                      className="p-3 bg-vibe-red/80 rounded-full text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>
    </div>
  );
}
