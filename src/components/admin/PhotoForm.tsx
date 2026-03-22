'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore'; // Import Timestamp
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  images: z.any(),
});

// Define the Photo type to match the parent component
interface Photo {
  id: string;
  url: string;
  createdAt: Timestamp;
}

// Update the props interface to expect an array of new photos
interface PhotoFormProps {
  onPhotoAdded: (newPhotos: Photo[]) => void;
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
        // Process all file uploads and document creations concurrently
        const newPhotos = await Promise.all(Array.from(imageFiles).map(async (imageFile) => {
          const storageRef = ref(storage, `photos/${Date.now()}_${imageFile.name}`);
          await uploadBytes(storageRef, imageFile);
          const imageURL = await getDownloadURL(storageRef);
          const createdAt = Timestamp.fromDate(new Date());

          // Create the document in Firestore
          const docRef = await addDoc(collection(db, 'photos'), {
            url: imageURL,
            createdAt: createdAt,
          });

          // Return the full Photo object, including the new ID
          return { 
            id: docRef.id, 
            url: imageURL, 
            createdAt: createdAt 
          };
        }));

        form.reset();
        // Pass the array of new photo objects back to the parent
        onPhotoAdded(newPhotos);
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
        className="flex items-center justify-center w-full px-4 py-3 bg-vibe-blue text-black font-bold rounded-xl uppercase tracking-wider text-sm disabled:opacity-50 transition-transform active:scale-[0.98]"
      >
        {uploading ? (
          <><Loader2 className="animate-spin mr-2" size={16}/> Uploading...</> 
        ) : (
          <><ImagePlus className="mr-2" size={16}/> Add Photos</>
        )}
      </button>
    </form>
  );
}
