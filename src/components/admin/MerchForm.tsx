'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { storage, db } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  image: z.any(),
});

interface MerchFormProps {
    onMerchAdded: () => void;
}

export function MerchForm({ onMerchAdded }: MerchFormProps) {
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setUploading(true);
    try {
      let imageURL = '';
      const imageFile = values.image?.[0];
      if (imageFile) {
        const storageRef = ref(storage, `merch/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageURL = await getDownloadURL(storageRef);
      }

      await addDoc(collection(db, 'merch'), {
        name: values.name,
        price: values.price,
        image: imageURL,
      });

      form.reset();
      onMerchAdded();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert("Failed to add item. Check console for details.")
    } finally {
      setUploading(false);
    }
  }

  return (
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
           <div className="grid md:grid-cols-2 gap-3">
                <input 
                    {...form.register('name')} 
                    placeholder="Item Name" 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" 
                    required 
                />
                <input 
                    type="number" 
                    step="0.01" 
                    {...form.register('price')} 
                    placeholder="Price (e.g. 19.99)" 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm" 
                    required 
                />
            </div>
            <div>
                <label className="text-[10px] uppercase font-bold text-white/40">Item Image</label>
                <input 
                    type="file"
                    {...form.register("image")} 
                    required
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-vibe-pink file:text-black hover:file:bg-vibe-purple"
                />
            </div>
            <button 
                type="submit" 
                disabled={uploading}
                className="w-full bg-vibe-pink hover:bg-vibe-purple disabled:opacity-50 p-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
            >
                {uploading ? <Loader2 className="animate-spin" size={12} /> : <Plus size={12} />} 
                {uploading ? 'Adding Item...' : 'Add New Item'}
            </button>
      </form>
  );
}
