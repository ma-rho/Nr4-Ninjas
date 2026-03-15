
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Instagram, Music, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AudioPlayer } from '@/components/AudioPlayer';
import { adminDb } from '@/lib/firebaseAdmin'; // Corrected import path
import type { Metadata, ResolvingMetadata } from 'next';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-2.43.03-4.83-1-6.7-2.9-1.31-1.31-2.13-3.1-2.24-4.95-.02-.34-.01-.68-.01-1.02.03-2.33.01-4.66.01-6.99.02-1.51.56-2.99 1.66-4.06 1.12-1.08 2.7-1.61 4.22-1.78v4.02c-1.45.05-2.9.34-4.21.97-.57-.26-1.1-.59-1.62.93v8.77c.02.01.03.03.05.04.53.2 1.08.31 1.64.38.83.09 1.67.06 2.5-.09.89-.16 1.75-.48 2.53-.97s1.42-1.13 1.88-1.91.71-1.67.73-2.59v-8.62c.03-1.5.63-2.96 1.73-4.04 1.1-1.08 2.66-1.62 4.2-1.78Z" />
    </svg>
);

// Define a type for the DJ data
interface DjData {
    id: string;
    name: string;
    slug: string;
    bio?: string;
    photo?: string;
    featuredMix?: string;
    instagram?: string;
    tiktok?: string;
    soundcloud?: string;
    gallery?: string[];
}

async function getDj(slug: string): Promise<DjData | null> {
    const djsRef = adminDb.collection('djs');
    const q = djsRef.where('slug', '==', slug);
    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as DjData;
}

// Generate Metadata for SEO
type Props = {
    params: { slug: string }
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const dj = await getDj(params.slug)

    if (!dj) {
        return {
            title: 'DJ Not Found',
            description: 'This DJ profile could not be found.'
        }
    }

    return {
        title: `${dj.name} | NR4 Ninjas Collective`,
        description: dj.bio || `The official profile of ${dj.name}, a member of the NR4 Ninjas DJ collective.`,
    }
}

export default async function DjProfilePage({ params }: { params: { slug: string } }) {
    const dj = await getDj(params.slug);

    if (!dj) {
        notFound();
    }

    const validGallery = dj.gallery
        ? dj.gallery.filter((image: string) => image && image.trim())
        : [];

    return (
        <div className="container mx-auto px-4 py-12">

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                <div className="md:col-span-1">
                    {dj.photo && (
                        <Card className="overflow-hidden border-none shadow-lg">
                            <CardContent className="p-0">
                                <Image
                                    src={dj.photo}
                                    alt={dj.name}
                                    width={600}
                                    height={600}
                                    className="aspect-square h-full w-full object-cover"
                                    priority // Prioritize loading of the main image
                                />
                            </CardContent>
                        </Card>
                    )}
                    <div className="mt-6 flex justify-center space-x-2">
                        {dj.instagram && (
                            <Button asChild variant="ghost" size="icon">
                                <Link href={dj.instagram} target="_blank">
                                    <Instagram className="h-5 w-5" />
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
                                    <Music className="h-5 w-5" />
                                    <span className="sr-only">SoundCloud</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h1 className="font-headline text-5xl uppercase text-primary md:text-7xl tracking-tighter">
                        {dj.name}
                    </h1>
                    <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-2xl">
                        {dj.bio}
                    </p>
                    <Button asChild size="lg" className="mt-8 px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                        <Link href="https://calendly.com/nr4ninjas/30min" target="_blank">
                            <Mic className="mr-2 h-6 w-6" /> Book {dj.name}
                        </Link>
                    </Button>
                </div>
            </div>

            {validGallery.length > 0 && (
                <>
                    <Separator className="my-16" />
                    <div>
                        <h2 className="text-center font-headline text-4xl uppercase tracking-widest">
                            Gallery
                        </h2>
                        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {validGallery.map((image: string, index: number) => (
                                <Card key={index} className="overflow-hidden border-none shadow-md group">
                                    <CardContent className="p-0 aspect-[3/2] bg-secondary relative">
                                        <Image
                                            src={image}
                                            alt={`${dj.name} gallery image ${index + 1}`}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <Separator className="my-16" />

            <div className="max-w-4xl mx-auto">
                <h2 className="text-center font-headline text-4xl uppercase tracking-widest mb-8">
                    Latest Mix
                </h2>
                {dj.featuredMix ? (
                    <AudioPlayer src={dj.featuredMix} />
                ) : (
                    <Card className="bg-secondary/20 border-dashed">
                        <CardContent className="p-12">
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                                <Music className="h-12 w-12 opacity-20 mb-4" />
                                <p className="text-sm uppercase tracking-widest">No featured mix available.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

        </div>
    );
}
