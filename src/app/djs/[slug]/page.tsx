'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Instagram, Music, Mic } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="0"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.7-2.9-1.31-1.31-2.13-3.1-2.24-4.95-.02-.34-.01-.68-.01-1.02.03-2.33.01-4.66.01-6.99.02-1.51.56-2.99 1.66-4.06 1.12-1.08 2.7-1.61 4.22-1.78v4.02c-1.45.05-2.9.34-4.21.97-.57.26-1.1-.59-1.62.93v8.77c.02.01.03.03.05.04.53.2 1.08.31 1.64.38.83.09 1.67.06 2.5-.09.89-.16 1.75-.48 2.53-.97s1.42-1.13 1.88-1.91.71-1.67.73-2.59v-8.62c.03-1.5.63-2.96 1.73-4.04 1.1-1.08 2.66-1.62 4.2-1.78Z" />
  </svg>
);

export default function DjProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const [dj, setDj] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = use(params);

  useEffect(() => {
    if (!slug) return;

    const q = query(collection(db, 'djs'), where('slug', '==', slug));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const djData = querySnapshot.docs[0].data();
        setDj({ id: querySnapshot.docs[0].id, ...djData });
      } else {
        notFound();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!dj) {
    return notFound();
  }

  const validGallery = dj.gallery
    ? dj.gallery.filter((image: string) => image && image.trim())
    : [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        <div className="md:col-span-1">
          {dj.photo && (
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={dj.photo}
                  alt={dj.name}
                  width={600}
                  height={600}
                  className="aspect-square h-full w-full object-cover"
                />
              </CardContent>
            </Card>
          )}
          <div className="mt-6 flex justify-center space-x-2">
            {dj.instagram && (
              <Button asChild variant="ghost" size="icon">
                <Link href={dj.instagram} target="_blank">
                  <Instagram />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
            )}
            {dj.tiktok && (
              <Button asChild variant="ghost" size="icon">
                <Link href={dj.tiktok} target="_blank">
                  <TikTokIcon className="h-5 w-5" />
                  <span className="sr-only">TikTok</span>
                </Link>
              </Button>
            )}
            {dj.soundcloud && (
              <Button asChild variant="ghost" size="icon">
                <Link href={dj.soundcloud} target="_blank">
                  <Music />
                  <span className="sr-only">SoundCloud</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="font-headline text-5xl uppercase text-primary md:text-7xl">
            {dj.name}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            {dj.bio}
          </p>
          <Button size="lg" className="mt-8">
            <Mic className="mr-2 h-5 w-5" /> Book {dj.name}
          </Button>
        </div>
      </div>

      {validGallery.length > 0 && (
        <>
          <Separator className="my-16" />
          <div>
            <h2 className="text-center font-headline text-4xl uppercase">
              Gallery
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {validGallery.map((image: string, index: number) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-0 aspect-[3/2] bg-secondary relative">
                    <Image
                      src={image}
                      alt={`${dj.name} gallery image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator className="my-16" />

      <div>
        <h2 className="text-center font-headline text-4xl uppercase">
          Latest Mix
        </h2>
        <Card className="mt-8 bg-secondary">
          <CardContent className="p-6">
            {dj.featuredMix ? (
              <audio controls className="w-full">
                <source src={dj.featuredMix} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <div className="flex h-36 items-center justify-center text-center text-muted-foreground">
                <div>
                  <Music className="mx-auto h-12 w-12" />
                  <p className="mt-4">No featured mix available.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
