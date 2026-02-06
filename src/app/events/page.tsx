'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  link: string;
  imageUrl: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const eventsData: Event[] = [];
      querySnapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="font-headline text-5xl uppercase text-primary md:text-7xl">
          Events
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find our next party. Join the story. 🥷
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center mt-12">
            <Loader2 className="animate-spin" size={48} />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="flex flex-col overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              {event.imageUrl && (
                <div className="aspect-square w-full overflow-hidden">
                  <Image
                    src={event.imageUrl}
                    alt={event.name}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="font-headline text-2xl uppercase">
                  {event.name}
                </CardTitle>
                <CardDescription className="font-body text-base !text-primary">
                  {new Date(event.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}{' '}
                  - {event.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={event.link} target="_blank">
                    Get Tickets ‼️
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
