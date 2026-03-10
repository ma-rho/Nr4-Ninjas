'use client';

import React, { useState, useMemo } from 'react';
// Use the standard hook to avoid context errors
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"; 
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast'; 
import { db } from '@/lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function AdvancedCardForm() {
  const { cart, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
  // Use script reducer for loading state
  const [{ isPending }] = usePayPalScriptReducer();
  
  const [formData, setFormData] = useState({ name: '', email: '' });

  const totalPrice = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0), 
  [cart]);

  const FUNCTIONS_URL = 'https://us-central1-nr4-9c722.cloudfunctions.net';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createOrder = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        variant: "destructive",
        title: "Details Required",
        description: "Please enter your name and email to enable checkout.",
      });
      // Returning an empty string prevents the PayPal popup from opening
      return ""; 
    }

    try {
      const response = await fetch(`${FUNCTIONS_URL}/createOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart: cart,
          name: formData.name,
          email: formData.email,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.id; 
    } catch (error: any) {
      console.error("PayPal Create Error:", error);
      toast({ 
        variant: "destructive", 
        title: "Order Error", 
        description: error.message || "Could not connect to payment server." 
      });
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch(`${FUNCTIONS_URL}/captureOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const orderData = await response.json();
      if (!response.ok) throw new Error(orderData.error || 'Capture failed');

      // 1. Log order to Firestore
      await addDoc(collection(db, "orders"), {
        paypalOrderId: data.orderID,
        customerName: formData.name,
        customerEmail: formData.email,
        items: cart,
        totalAmount: totalPrice,
        currency: 'GBP',
        status: 'COMPLETED',
        createdAt: serverTimestamp(),
      });

      // 2. Success Feedback
      toast({ 
        title: "Payment Successful!", 
        description: "Thank you! Redirecting to the homepage..." 
      });

      // 3. Cleanup and Redirect
      clearCart();
      setTimeout(() => {
        router.push('/');
      }, 2500);

    } catch (error: any) {
      console.error("PayPal Capture Error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Authorization successful but capture failed. Please contact support.",
      });
    }
  };

  // Show a spinner while the PayPal SDK is loading
  if (isPending) {
    return (
      <div className="py-8 flex flex-col items-center justify-center space-y-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-xs text-muted-foreground animate-pulse">Initializing Secure Checkout...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 border-t border-border">
      <div className="grid gap-2 text-left">
        <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest opacity-60">
          Full Name
        </Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="John Doe" 
          value={formData.name} 
          onChange={handleInputChange}
          className="bg-secondary/20 border-none focus-visible:ring-1"
        />
      </div>
      <div className="grid gap-2 text-left">
        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest opacity-60">
          Email Address
        </Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="john@example.com" 
          value={formData.email} 
          onChange={handleInputChange}
          className="bg-secondary/20 border-none focus-visible:ring-1"
        />
      </div>

      <div className="mt-6 min-h-[150px]">
        <PayPalButtons
          style={{ layout: 'vertical', shape: 'rect', label: 'pay', height: 45 }}
          createOrder={createOrder}
          onApprove={onApprove}
          // Button re-renders when inputs or cart change
          forceReRender={[formData.name, formData.email, cart, totalPrice]} 
        />
      </div>
    </div>
  );
}