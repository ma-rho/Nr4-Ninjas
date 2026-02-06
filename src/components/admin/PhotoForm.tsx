'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  images: z.any(),
});

interface PhotoFormProps {
  onPhotoAdded: () => void;
}

export function PhotoForm({ onPhotoAdded }: PhotoFormProps) {
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      const imageFiles = values.images as FileList;
      if (imageFiles && imageFiles.length > 0) {
        const uploadPromises = Array.from(imageFiles).map(async (imageFile) => {
          const storageRef = ref(storage, `photos/${Date.now()}_${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          const imageURL = await getDownloadURL(storageRef);

          return addDoc(collection(db, 'photos'), {
            url: imageURL,
            createdAt: new Date().toISOString(),
          });
        });

        await Promise.all(uploadPromises);

        form.reset();
        onPhotoAdded();
      }
    } catch (error) {
      console.error('Error adding documents: ', error);
      alert("Failed to upload photos. Check console for details.")
    } finally {
        setUploading(false);
    }
  }

  return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
           <div>
                <label className="text-[10px] uppercase font-bold text-white/40">Upload New Photos</label>
                <input 
                    type="file"
                    accept="image/*"
                    multiple
                    {...form.register("images")} 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vibe-blue file:text-black hover:file:bg-white transition-all cursor-pointer"
                />
            </div>
            <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-vibe-blue hover:bg-white hover:text-black disabled:opacity-50 p-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
            >
                {uploading ? <Loader2 className="animate-spin" size={12} /> : <ImagePlus size={12} />} 
                {uploading ? 'Uploading Photos...' : 'Upload Photos'}
            </button>
      </form>
  );
}
