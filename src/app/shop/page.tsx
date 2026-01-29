import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { products } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="font-headline text-5xl uppercase text-primary md:text-7xl">
          Shop
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Official NR4 NINJAS merchandise. Limited drops.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const productImage = PlaceHolderImages.find(
            (img) => img.id === product.image
          );
          return (
            <Card
              key={product.id}
              className="group flex flex-col overflow-hidden"
            >
              <div className="overflow-hidden">
                {productImage && (
                  <Image
                    src={productImage.imageUrl}
                    alt={productImage.description}
                    data-ai-hint={productImage.imageHint}
                    width={600}
                    height={600}
                    className="aspect-square h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="font-headline text-xl uppercase">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex items-center justify-between">
                <p className="font-body text-2xl font-bold text-primary">
                  £{product.price.toFixed(2)}
                </p>
                <Button>Add to Cart</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
