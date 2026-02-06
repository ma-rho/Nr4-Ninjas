'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Plus, Loader2 } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  bio: z.string().optional(),
  photo: z.any().optional(),
  featuredMix: z.any().optional(),
  instagram: z.string().url().optional().or(z.literal('')),
  tiktok: z.string().url().optional().or(z.literal('')),
  soundcloud: z.string().url().optional().or(z.literal('')),
  gallery: z.any().optional(),
});

interface DJFormProps {
  onDJAdded: () => void;
}

export function DJForm({ onDJAdded }: DJFormProps) {
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      bio: '',
      instagram: '',
      tiktok: '',
      soundcloud: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      // Upload DJ photo
      let photoURL = '';
      const imageFile = values.photo?.[0];
      if (imageFile) {
        const photoStorageRef = ref(storage, `djs/photos/${imageFile.name}`);
        await uploadBytes(photoStorageRef, imageFile);
        photoURL = await getDownloadURL(photoStorageRef);
      }
      
      // Upload Featured Mix with file type validation
      let mixURL = '';
      const mixFile = values.featuredMix?.[0];
      if (mixFile) {
        const allowedMixTypes = ['audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a'];
        if (!allowedMixTypes.includes(mixFile.type)) {
          alert('Invalid file type for mix. Please upload an MP3, WAV, or M4A file.');
          setUploading(false);
          return;
        }
        const mixStorageRef = ref(storage, `djs/mixes/${mixFile.name}`);
        await uploadBytes(mixStorageRef, mixFile);
        mixURL = await getDownloadURL(mixStorageRef);
      }

      // Upload Gallery Images
      const galleryURLs: string[] = [];
      if (values.gallery?.length) {
        for (const file of Array.from(values.gallery as FileList)) {
            const galleryStorageRef = ref(storage, `djs/gallery/${file.name}`);
            await uploadBytes(galleryStorageRef, file);
            const url = await getDownloadURL(galleryStorageRef);
            galleryURLs.push(url);
        }
      }

      // Add DJ to Firestore
      await addDoc(collection(db, 'djs'), {
        name: values.name,
        slug: values.name.toLowerCase().replace(/\s+/g, '-'),
        bio: values.bio,
        photo: photoURL,
        featuredMix: mixURL,
        instagram: values.instagram,
        tiktok: values.tiktok,
        soundcloud: values.soundcloud,
        gallery: galleryURLs,
      });

      form.reset();
      onDJAdded();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert("Failed to add DJ. Check the console for details.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
            <input 
                placeholder="DJ Name"
                {...form.register("name")} 
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" 
                required 
            />
            <textarea 
                placeholder="Bio (optional)"
                {...form.register("bio")} 
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm h-20 resize-none"
            />
            <div>
                <label className="text-[10px] uppercase font-bold text-white/40">DJ Photo (optional)</label>
                <input 
                    type="file"
                    accept="image/*"
                    {...form.register("photo")} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vibe-pink file:text-black hover:file:bg-vibe-purple"
                />
            </div>
            <div>
                <label className="text-[10px] uppercase font-bold text-white/40">Featured Mix (optional)</label>
                <input 
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/mp4,audio/x-m4a"
                    {...form.register("featuredMix")} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vibe-pink file:text-black hover:file:bg-vibe-purple"
                />
            </div>
             <div>
                <label className="text-[10px] uppercase font-bold text-white/40">Gallery Images (optional)</label>
                <input 
                    type="file"
                    accept="image/*"
                    multiple
                    {...form.register("gallery")} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vibe-pink file:text-black hover:file:bg-vibe-purple"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                 <input 
                    placeholder="Instagram URL (optional)"
                    {...form.register("instagram")} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" 
                />
                <input 
                    placeholder="TikTok URL (optional)"
                    {...form.register("tiktok")} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" 
                />
                <input 
                    placeholder="SoundCloud URL (optional)"
                    {...form.register("soundcloud")} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" 
                />
            </div>
        </div>

        <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-vibe-purple hover:bg-vibe-pink disabled:opacity-50 p-4 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
        >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} 
            {uploading ? 'Adding DJ...' : 'Add DJ'}
        </button>
    </form>
  );
}
