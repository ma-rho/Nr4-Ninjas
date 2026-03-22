'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy, limit, startAfter, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { PhotoForm } from './PhotoForm';

interface Photo {
  id: string;
  url: string;
  createdAt: Timestamp;
}

export function PhotoManagement() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef(null);
  const initialLoad = useRef(true);

  const fetchPhotos = useCallback(async (reloading = false) => {
    if (!hasMore && !reloading) return;
    setLoading(true);

    try {
      const photosCollection = collection(db, 'photos');
      let q;
      if (reloading) {
        q = query(photosCollection, orderBy('createdAt', 'desc'), limit(12));
      } else {
        q = query(photosCollection, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(12));
      }

      const querySnapshot = await getDocs(q);
      const newPhotos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));

      if (reloading) {
        setPhotos(newPhotos);
      } else {
        setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
      }
      
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      if (querySnapshot.empty || querySnapshot.docs.length < 12) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching photos: ", error);
    } finally {
      setLoading(false);
    }
  }, [lastVisible, hasMore]);

  useEffect(() => {
    if (initialLoad.current) {
      fetchPhotos(true); // Initial load
      initialLoad.current = false;
    }
  }, [fetchPhotos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !initialLoad.current) {
          fetchPhotos();
        }
      },
      { threshold: 1.0 }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchPhotos, photos]);

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, 'photos', id));
      setPhotos(photos.filter((photo) => photo.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }

  // Updated function to accept an array of new photos
  const handlePhotoAdded = (newPhotos: Photo[]) => {
    // Add new photos to the top of the list for immediate visibility
    setPhotos(prevPhotos => [...newPhotos, ...prevPhotos]);
  };

  return (
    <div className="glass-card p-4 md:p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="text-vibe-blue" />
        <h2 className="text-xl font-black uppercase tracking-widest italic">Photo Gallery</h2>
      </div>
      
      <PhotoForm onPhotoAdded={handlePhotoAdded} />
      
      <div className="mt-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 italic">Uploaded Photos</h3>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
              <Image
                src={photo.url}
                alt="Gallery photo"
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 20vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <button 
                onClick={() => handleDelete(photo.id)} 
                className="absolute top-1.5 right-1.5 z-10 p-1.5 rounded-full bg-black/50 text-white/70 hover:bg-vibe-red hover:text-white transition-all backdrop-blur-sm"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <div ref={loader} className="flex justify-center items-center p-4">
          {loading && <Loader2 className="animate-spin text-vibe-blue" />}
          {!hasMore && photos.length > 0 && <p className="text-xs text-white/40 italic">No more photos to load.</p>}
        </div>
        
      </div>
    </div>
  );
}
