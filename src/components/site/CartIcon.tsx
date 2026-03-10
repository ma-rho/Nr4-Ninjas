'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { StripeCheckoutButton } from './StripeCheckoutButton';

export function CartIcon() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 hover:bg-accent rounded-full transition-colors focus:outline-none">
          <ShoppingBag size={24} />
          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in">
              {totalItems}
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 max-h-[90vh] overflow-hidden flex flex-col shadow-xl border-muted mr-4">
        <div className="p-4 border-b">
          <h4 className="font-bold text-lg leading-none">Your Cart</h4>
          <p className="text-sm text-muted-foreground mt-1">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} selected
          </p>
        </div>

        {/* Item List Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[100px] max-h-80">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="grid grid-cols-[60px_1fr_auto] items-center gap-4 border-b border-muted pb-4 last:border-0 last:pb-0">
                <div className="bg-secondary/30 rounded-md w-[60px] h-[60px] flex items-center justify-center relative overflow-hidden">
                  <Image 
                    src={item.imageUrl} 
                    alt={item.name} 
                    fill
                    className="object-cover p-1" 
                  />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
                      className="w-14 h-7 text-xs text-center px-1"
                    />
                    <p className="text-xs text-muted-foreground">× £{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeFromCart(item.id)} 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Your cart is empty.</p>
            </div>
          )}
        </div>

        {/* Checkout Section */}
        {cart.length > 0 && (
          <div className="p-4 bg-muted/20 border-t space-y-4">
            <div className="flex justify-between items-center font-bold">
              <p className="text-sm">Total Amount</p>
              <p className="text-lg">£{totalPrice.toFixed(2)}</p>
            </div>
            
            {/* We wrap the button and close the popover when clicked 
               to prevent UI glitches during Stripe redirect 
            */}
            <div onClick={() => setTimeout(() => setIsOpen(false), 500)}>
              <StripeCheckoutButton />
            </div>
            
            <p className="text-[10px] text-center text-muted-foreground">
              Taxes and shipping calculated at checkout
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}