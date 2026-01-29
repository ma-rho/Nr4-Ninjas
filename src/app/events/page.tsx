import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { events } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function EventsPage() {
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

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const eventImage = PlaceHolderImages.find(
            (img) => img.id === event.artwork
          );
          return (
            <Card
              key={event.id}
              className="flex flex-col overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10"
            >
              {eventImage && (
                <div className="aspect-square w-full overflow-hidden">
                  <Image
                    src={eventImage.imageUrl}
                    alt={eventImage.description}
                    data-ai-hint={eventImage.imageHint}
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
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={event.ticketUrl} target="_blank">
                    Get Tickets ‼️
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
