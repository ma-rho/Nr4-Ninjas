'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, 'merch'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.image,
    });
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

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
        {products.map((product) => (
          <Card key={product.id} className="group flex flex-col overflow-hidden">
            <div className="overflow-hidden">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
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
              <Button onClick={() => handleAddToCart(product)}>Add to Cart</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
