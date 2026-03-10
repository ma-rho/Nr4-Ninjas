'use client';

import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function SuccessClient() {
  const { clearCart } = useCart();

  useEffect(() => {
    // This runs once when the page loads
    clearCart();
  }, [clearCart]);

  return null; // This component doesn't need to show anything
}
