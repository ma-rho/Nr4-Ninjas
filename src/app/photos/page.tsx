import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

export default function PhotosPage() {
  const galleryImages = PlaceHolderImages.filter((img) =>
    img.id.startsWith('gallery-')
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="font-headline text-5xl uppercase text-primary md:text-7xl">
          Photos 📸
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Scenes from the live story. Find yourself.
        </p>
      </div>

      <div className="mt-12 columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
        {galleryImages.map((image, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  data-ai-hint={image.imageHint}
                  width={600}
                  height={400}
                  className="h-auto w-full"
                />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
