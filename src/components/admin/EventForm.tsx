'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { db, storage } from '@/lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Event name must be at least 2 characters.' }),
  date: z.string(),
  location: z.string().min(2, { message: 'Location must be at least 2 characters.' }),
  link: z.string().url({ message: 'Please enter a valid URL.' }),
});

interface EventFormProps {
  onEventAdded: () => void;
}

export function EventForm({ onEventAdded }: EventFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      date: '',
      location: '',
      link: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (values) => {
    if (!image) {
      alert('Please select an image for the event.');
      return;
    }
    setSubmitting(true);
    try {
      const imageRef = ref(storage, `events/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const eventDate = new Date(values.date).toISOString();
      await addDoc(collection(db, 'events'), { ...values, date: eventDate, imageUrl });
      form.reset();
      setImage(null);
      onEventAdded();
    } catch (error) {
      console.error('Error adding document: ', error);
      alert("Failed to add event. See console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-5 gap-3 mb-8">
      <input {...form.register('name')} placeholder="Event Name" className="bg-white/5 border border-white/10 p-3 rounded-xl text-sm" required />
      <input type="date" {...form.register('date')} className="bg-white/5 border border-white/10 p-3 rounded-xl text-sm" required />
      <input {...form.register('location')} placeholder="Event Location" className="bg-white/5 border border-white/10 p-3 rounded-xl text-sm" required />
      <input type="url" {...form.register('link')} placeholder="RSVP/Ticket Link" className="bg-white/5 border border-white/10 p-3 rounded-xl text-sm" required />
      <input type="file" onChange={handleImageChange} className="bg-white/5 border border-white/10 p-3 rounded-xl text-sm" required />
      <button type="submit" disabled={submitting} className="md:col-span-5 bg-vibe-red hover:bg-white hover:text-black p-3 rounded-full font-black uppercase text-[10px] transition-all flex items-center justify-center gap-2">
        {submitting ? <Loader2 className="animate-spin" size={12} /> : <Plus size={12} />} 
        {submitting ? 'Adding...' : 'Add New Event'}
      </button>
    </form>
  );
}
