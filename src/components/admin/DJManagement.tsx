'use client';

import { DJForm } from '@/components/admin/DJForm';
import { db, storage } from '@/lib/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Users, Trash2 } from 'lucide-react';

async function getDJs() {
  const djsCollection = collection(db, 'djs');
  const djSnapshot = await getDocs(djsCollection);
  const djs = djSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return djs;
}

export function DJManagement() {
  const [djs, setDjs] = useState<any[]>([]);
  const router = useRouter();

  const loadDJs = async () => {
    const djsFromServer = await getDJs();
    setDjs(djsFromServer);
  };

  useEffect(() => {
    loadDJs();
  }, []);

  async function handleDelete(id: string) {
    const djToDelete = djs.find(dj => dj.id === id);
    if (!djToDelete) {
      console.error('DJ to delete not found in state');
      return;
    }

    try {
      // Delete photo from Storage
      if (djToDelete.photo) {
        try {
            const photoRef = ref(storage, djToDelete.photo);
            await deleteObject(photoRef);
        } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
                throw error;
            }
        }
      }

      // Delete gallery images from Storage
      if (djToDelete.gallery && djToDelete.gallery.length > 0) {
        await Promise.all(djToDelete.gallery.map(async (url: string) => {
            try {
                const galleryImageRef = ref(storage, url);
                await deleteObject(galleryImageRef);
            } catch (error: any) {
                if (error.code !== 'storage/object-not-found') {
                    throw error;
                }
            }
        }));
      }

      // Delete featured mix from Storage
      if (djToDelete.featuredMix) {
        try {
            const mixRef = ref(storage, djToDelete.featuredMix);
            await deleteObject(mixRef);
        } catch (error: any) {
            if (error.code !== 'storage/object-not-found') {
                throw error;
            }
        }
      }

      // Delete Firestore document
      await deleteDoc(doc(db, 'djs', id));

      setDjs(djs.filter((dj) => dj.id !== id));
      router.refresh();
    } catch (error) {
      console.error('Error deleting DJ and associated files: ', error);
    }
  }

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
            <Users className="text-vibe-purple" />
            <h2 className="text-xl font-black uppercase tracking-widest italic">Manage DJs</h2>
        </div>
        <DJForm onDJAdded={loadDJs} />
        <div className="mt-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 italic">Existing DJs</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {djs.map((dj: any) => (
                    <div key={dj.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div>
                            <p className="font-bold text-sm">{dj.name}</p>
                        </div>
                        <button 
                            onClick={() => { if(confirm("Delete this DJ and all their files?")) handleDelete(dj.id) }}
                            className="p-2 text-white/20 hover:text-vibe-red transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
