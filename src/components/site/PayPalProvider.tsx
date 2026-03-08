'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { ReactNode } from 'react';

interface PayPalProviderProps {
  children: ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId || clientId === 'YOUR_CLIENT_ID') {
    console.error('PayPal Client ID is not configured.');
  }
  
  const initialOptions = {
    clientId: clientId || 'YOUR_CLIENT_ID',
    currency: 'GBP',
    intent: 'capture',
    // CRITICAL: Request both buttons and card-fields for Expanded Checkout
    components: 'buttons,card-fields', 
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}