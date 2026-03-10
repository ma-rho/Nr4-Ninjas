'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createCheckoutSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard } from 'lucide-react';

export function StripeCheckoutButton() {
  const { cart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0 || isLoading) return;

    setIsLoading(true);
    try {
      const { url } = await createCheckoutSession(cart);
      if (url) {
        // Redirecting to Stripe's hosted checkout
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Failed to initiate checkout. Please try again.");
      setIsLoading(false); // Reset loading state on error
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={isLoading || cart.length === 0}
      className="w-full bg-[#635bff] hover:bg-[#534bc3] text-white font-bold py-6 h-auto transition-all shadow-md active:scale-[0.98]"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Preparing Checkout...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-5 w-5" />
          Pay with Stripe
        </>
      )}
    </Button>
  );
}