'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression'; // New Import

const formSchema = z.object({
  images: z.any(),
});

interface Photo {
  id: string;
  url: string;
  createdAt: Timestamp;
}

interface PhotoFormProps {
  onPhotoAdded: (newPhotos: Photo[]) => void;
}

export function PhotoForm({ onPhotoAdded }: PhotoFormProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(""); // Track which file is processing
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      const imageFiles = values.images as FileList;
      if (imageFiles && imageFiles.length > 0) {
        
        // Settings for compression
        const compressionOptions = {
          maxSizeMB: 1,           // Target size under 1MB
          maxWidthOrHeight: 1920, // Max resolution for web
          useWebWorker: true,
          fileType: 'image/webp'  // Convert to modern WebP format
        };

        const newPhotos = await Promise.all(Array.from(imageFiles).map(async (imageFile, index) => {
          setProgress(`Compressing image ${index + 1}...`);
          
          // 1. COMPRESS THE IMAGE BEFORE UPLOAD
          const compressedFile = await imageCompression(imageFile, compressionOptions);
          
          setProgress(`Uploading image ${index + 1}...`);
          
          // Change extension to .webp in filename
          const fileName = imageFile.name.replace(/\.[^/.]+$/, "") + ".webp";
          const storageRef = ref(storage, `photos/${Date.now()}_${fileName}`);
          
          // 2. UPLOAD THE COMPRESSED FILE
          await uploadBytes(storageRef, compressedFile);
          const imageURL = await getDownloadURL(storageRef);
          const createdAt = Timestamp.fromDate(new Date());

          const docRef = await addDoc(collection(db, 'photos'), {
            url: imageURL,
            createdAt: createdAt,
          });

          return { 
            id: docRef.id, 
            url: imageURL, 
            createdAt: createdAt 
          };
        }));

        form.reset();
        onPhotoAdded(newPhotos);
        setProgress("");
      }
    } catch (error) {
      console.error('Error adding documents: ', error);
      alert("Failed to upload photos. Check console for details.");
    } finally {
      setUploading(false);
      setProgress("");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="text-[10px] uppercase font-bold text-white/40 mb-2 block">
          Upload New Photos (Auto-compressed to WebP)
        </label>
        <input 
          type="file"
          accept="image/*"
          multiple
          {...form.register("images")} 
          required
          disabled={uploading}
          className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vibe-blue file:text-black hover:file:bg-white transition-all cursor-pointer disabled:opacity-50"
        />
      </div>

      {progress && (
        <p className="text-[10px] text-vibe-blue animate-pulse uppercase font-bold text-center">
          {progress}
        </p>
      )}

      <button 
        type="submit" 
        disabled={uploading}
        className="flex items-center justify-center w-full px-4 py-3 bg-vibe-blue text-black font-bold rounded-xl uppercase tracking-wider text-sm disabled:opacity-50 transition-all active:scale-[0.98] hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]"
      >
        {uploading ? (
          <><Loader2 className="animate-spin mr-2" size={16}/> Processing...</> 
        ) : (
          <><ImagePlus className="mr-2" size={16}/> Add Photos</>
        )}
      </button>
    </form>
  );
}