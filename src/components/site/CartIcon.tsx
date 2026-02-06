'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import CheckoutButton from './CheckoutButton';

export function CartIcon() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative">
          <ShoppingBag size={24} />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Shopping Cart</h4>
            <p className="text-sm text-muted-foreground">Your items</p>
          </div>
          <div className="grid gap-4">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="grid grid-cols-[50px_1fr_auto] items-center gap-4">
                  <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="rounded-md" />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                      <Input 
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                        className="w-14 text-center"
                      />
                      <Button size="icon" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              ))
            ) : (
              <p>Your cart is empty.</p>
            )}
          </div>
          {cart.length > 0 && (
             <div className="border-t pt-4">
                <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>£{totalPrice.toFixed(2)}</p>
                </div>
                <div className="mt-4">
                  <CheckoutButton />
                </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
