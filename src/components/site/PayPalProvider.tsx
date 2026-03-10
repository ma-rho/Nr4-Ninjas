'use client';

// Change this import to the standard one
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export const PayPalProvider = ({ children }: { children: React.ReactNode }) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  if (!clientId) {
    console.error("PayPal Client ID is missing! Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your .env.local");
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId,
        currency: "GBP",
        intent: "capture",
        // This ensures the button logic is loaded and ready
        components: "buttons", 
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
};