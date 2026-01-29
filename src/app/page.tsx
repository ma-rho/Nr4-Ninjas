import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { events, products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const nextEvent = events[0];
  const nextEventImage = PlaceHolderImages.find(
    (img) => img.id === nextEvent.artwork
  );
  const featuredProduct = products[0];
  const featuredProductImage = PlaceHolderImages.find(
    (img) => img.id === featuredProduct.image
  );

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full md:h-[80vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="font-headline text-5xl uppercase md:text-8xl">
            NR4 NINJAS
          </h1>
          <p className="mt-4 font-body text-xl tracking-widest md:text-2xl">
            A live story.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/events">View Events ‼️</Link>
          </Button>
        </div>
      </section>

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
              <p className="mt-2">{nextEvent.description}</p>
              <Button asChild className="mt-6">
                <Link href={nextEvent.ticketUrl} target="_blank">
                  Get Tickets
                </Link>
              </Button>
            </div>
            {nextEventImage && (
              <Card className="overflow-hidden border-2 border-primary shadow-2xl shadow-primary/20">
                <CardContent className="p-0">
                  <Image
                    src={nextEventImage.imageUrl}
                    alt={nextEventImage.description}
                    data-ai-hint={nextEventImage.imageHint}
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

      <Separator />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12">
            {featuredProductImage && (
              <div className="order-last md:order-first">
                <Card className="overflow-hidden">
                  <CardContent className="p-0">
                    <Image
                      src={featuredProductImage.imageUrl}
                      alt={featuredProductImage.description}
                      data-ai-hint={featuredProductImage.imageHint}
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
    </div>
  );
}
