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
  
  // Use a ref for the loader to prevent observer re-attachment loops
  const loaderRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const fetchPhotos = useCallback(async (reloading = false) => {
    if (loading || (!hasMore && !reloading)) return;
    setLoading(true);

    try {
      const photosCollection = collection(db, 'photos');
      const q = reloading 
        ? query(photosCollection, orderBy('createdAt', 'desc'), limit(15))
        : query(photosCollection, orderBy('createdAt', 'desc'), startAfter(lastVisible), limit(15));

      const querySnapshot = await getDocs(q);
      const newPhotos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Photo));

      setPhotos(prev => reloading ? newPhotos : [...prev, ...newPhotos]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === 15);
    } catch (error) {
      console.error("Error fetching photos: ", error);
    } finally {
      setLoading(false);
    }
  }, [lastVisible, hasMore, loading]);

  // Initial load
  useEffect(() => {
    if (isInitialMount.current) {
      fetchPhotos(true);
      isInitialMount.current = false;
    }
  }, [fetchPhotos]);

  // Stable Intersection Observer for Mobile Safari
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // threshold 0.1 is more stable on Safari than 1.0
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPhotos();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
      observer.disconnect();
    };
  }, [fetchPhotos, hasMore, loading]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    try {
      await deleteDoc(doc(db, 'photos', id));
      setPhotos(prev => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }

  const handlePhotoAdded = (newPhotos: Photo[]) => {
    setPhotos(prev => [...newPhotos, ...prev]);
  };

  return (
    <div className="glass-card p-4 md:p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-6">
        <Camera className="text-vibe-blue" />
        <h2 className="text-xl font-black uppercase tracking-widest italic text-white">Photo Gallery</h2>
      </div>
      
      <PhotoForm onPhotoAdded={handlePhotoAdded} />
      
      <div className="mt-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 italic">Uploaded Photos</h3>
        
        {/* Admin grid uses a simple grid for easy management, while the public page uses masonry */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
              <Image
                src={photo.url}
                alt="Admin thumbnail"
                fill
                // Very small sizes for admin thumbnails drastically reduces Safari memory load
                sizes="150px" 
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <button 
                onClick={() => handleDelete(photo.id)} 
                className="absolute top-1 right-1 z-10 p-1.5 rounded-full bg-black/60 text-white/70 hover:bg-red-500 hover:text-white transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>

        <div ref={loaderRef} className="flex justify-center items-center p-10 min-h-[100px]">
          {loading ? (
            <Loader2 className="animate-spin text-vibe-blue" />
          ) : !hasMore && photos.length > 0 ? (
            <p className="text-xs text-white/40 italic uppercase tracking-widest">End of Gallery</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}