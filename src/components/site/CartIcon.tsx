'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { FirebasePayPalForm } from './FirebasePayPalForm'; // Import the new Firebase-backed form

export function CartIcon() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
          <ShoppingBag size={24} />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
              {totalItems}
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 max-h-[90vh] overflow-y-auto shadow-xl border-muted">
        <div className="grid gap-4 p-1">
          <div className="space-y-1">
            <h4 className="font-bold text-lg leading-none">Your Cart</h4>
            <p className="text-sm text-muted-foreground">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
            </p>
          </div>

          {/* Item List Section */}
          <div className="grid gap-4 max-h-64 overflow-y-auto py-2">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="grid grid-cols-[60px_1fr_auto] items-center gap-4 border-b border-muted pb-3 last:border-0">
                  <div className="bg-muted rounded-md w-[60px] h-[60px] flex items-center justify-center">
                    <Image src={item.imageUrl} alt={item.name} width={50} height={50} className="object-contain mix-blend-multiply" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium leading-tight">{item.name}</p>
                    <div className="flex items-center gap-2">
                       <Input 
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                        className="w-16 h-8 text-center"
                      />
                      <p className="text-sm text-muted-foreground">@ £{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4"/>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">Your cart is empty.</p>
            )}
          </div>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <div className="border-t border-muted pt-4 space-y-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <p>Total</p>
                <p>£{totalPrice.toFixed(2)}</p>
              </div>

              {/* The new, unified Firebase PayPal Form for card payments */}
              <FirebasePayPalForm />

              <p className="text-[10px] text-center text-muted-foreground px-4">
                Secure card checkout powered by PayPal. Your details are not stored on our servers.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
