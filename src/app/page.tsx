'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  link: string;
  imageUrl: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function Home() {
  const [nextEvent, setNextEvent] = useState<Event | null>(null);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const today = new Date().toISOString();
    const eventQuery = query(
      collection(db, 'events'),
      where('date', '>=', today),
      orderBy('date', 'asc'),
      limit(1)
    );
    const unsubscribeEvent = onSnapshot(eventQuery, (snapshot) => {
      if (!snapshot.empty) {
        const eventData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Event;
        setNextEvent(eventData);
      }
    });

    const productQuery = query(collection(db, 'merch'), orderBy('name'), limit(1));
    const unsubscribeProduct = onSnapshot(productQuery, (snapshot) => {
      if (!snapshot.empty) {
        const productData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Product;
        setFeaturedProduct(productData);
      }
    });

    return () => {
      unsubscribeEvent();
      unsubscribeProduct();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full md:h-[80vh]">
        <Image
          src="/backlogo.jpeg"
          alt="NR4 NINJAS Logo"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="font-headline text-5xl uppercase md:text-8xl">
            NR4 NINJAS
          </h1>
          <p className="mt-4 font-body text-xl tracking-widest md:text-2xl">
            A live story.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/events">View Events </Link>
          </Button>
        </div>
      </section>

      {nextEvent && (
        <section className="bg-secondary py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="text-center md:text-left">
                <h2 className="font-headline text-3xl uppercase text-primary md:text-4xl">
                  Next Event
                </h2>
                <h3 className="mt-2 font-headline text-4xl uppercase md:text-5xl">
                  {nextEvent.name}
                </h3>
                <p className="mt-4 text-lg text-muted-foreground">
                  {new Date(nextEvent.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  - {nextEvent.location}
                </p>
                <Button asChild className="mt-6">
                  <Link href={nextEvent.link} target="_blank">
                    Get Tickets
                  </Link>
                </Button>
              </div>
              {nextEvent.imageUrl && (
                <Card className="overflow-hidden border-2 border-primary shadow-2xl shadow-primary/20">
                  <CardContent className="p-0">
                    <Image
                      src={nextEvent.imageUrl}
                      alt={nextEvent.name}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      <Separator />

      {featuredProduct && (
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
              {featuredProduct.image && (
                <div className="order-last md:order-first">
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <Image
                        src={featuredProduct.image}
                        alt={featuredProduct.name}
                        width={600}
                        height={600}
                        className="h-full w-full object-cover"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
              <div className="text-center md:text-left">
                <h2 className="font-headline text-3xl uppercase text-primary md:text-4xl">
                  Featured Merch
                </h2>
                <h3 className="mt-2 font-headline text-4xl uppercase md:text-5xl">
                  {featuredProduct.name}
                </h3>
                <p className="mt-4 text-lg text-muted-foreground">
                  £{featuredProduct.price.toFixed(2)}
                </p>
                <p className="mt-2">
                  Fresh new drop. Rep the ninjas in style.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/shop">Shop Now 🥷</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
