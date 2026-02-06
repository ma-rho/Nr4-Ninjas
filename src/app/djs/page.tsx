'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function DJsPage() {
  const [djs, setDjs] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'djs'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const djsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDjs(djsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="font-headline text-5xl uppercase text-primary md:text-7xl">
          The Ninjas
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Meet the resident DJs running the scene.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {djs.map((dj) => (
          <Link key={dj.id} href={`/djs/${dj.slug}`} className="group block">
            <Card className="overflow-hidden">
              <CardContent className="relative aspect-square p-0">
                {dj.photo && (
                  <Image
                    src={dj.photo}
                    alt={dj.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="font-headline text-3xl uppercase text-white">
                    {dj.name}
                  </h2>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
