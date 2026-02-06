'use client';

import { EventForm } from '@/components/admin/EventForm';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, Trash2, Link as LinkIcon } from 'lucide-react';

async function getEvents() {
  const eventsCollection = collection(db, 'events');
  const eventSnapshot = await getDocs(eventsCollection);
  const events = eventSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  // Sort events by date, newest first
  return events.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function EventManagement() {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  const loadEvents = async () => {
    const eventsFromServer = await getEvents();
    setEvents(eventsFromServer);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, 'events', id));
      setEvents(events.filter((event) => event.id !== id));
      router.refresh();
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-6">
            <Calendar className="text-vibe-red" />
            <h2 className="text-xl font-black uppercase tracking-widest italic">Manage Events</h2>
        </div>
        <EventForm onEventAdded={loadEvents} />
        <div className="mt-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4 italic">Upcoming & Past Events</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {events.map((event: any) => (
                <div key={event.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <p className="font-bold text-sm">{event.name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-tighter">{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={event.link} target="_blank" className="p-2 text-white/20 hover:text-vibe-purple transition-all">
                      <LinkIcon size={16} />
                    </a>
                    <button 
                      onClick={() => { if(confirm("Delete this event?")) handleDelete(event.id) }}
                      className="p-2 text-white/20 hover:text-vibe-red transition-all"
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
