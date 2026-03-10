'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { 
  PayPalProvider, 
  usePayPalOneTimePaymentSession, 
  usePayPalCreditOneTimePaymentSession,
  usePayPal,
  INSTANCE_LOADING_STATE
} from "@paypal/react-paypal-js/sdk-v6";

// Define your Firebase Cloud Functions base URL
const FIREBASE_REGION = 'us-central1'; // Check your Firebase dashboard for this
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // Your actual project ID
const functionsBaseUrl = `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

const CustomPayPalButtons = () => {
    const { cart, clearCart } = useCart();
    const { loadingStatus } = usePayPal();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Create Order Handler
    const handleCreateOrder = async (): Promise<{ orderId: string }> => {
        try {
            const response = await fetch(`${functionsBaseUrl}/createOrder`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                // Note: Your backend expects name/email. Adjust as needed.
                body: JSON.stringify({ 
                    cart, 
                    name: "Customer Name", // Replace with actual user data or state
                    email: "customer@example.com" 
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to create order.");
            
            // Map 'id' from Firebase response to 'orderId' for PayPal V6
            return { orderId: data.id }; 
        } catch (err: any) {
            setErrorMsg(err.message);
            throw err;
        }
    };

    // Capture Order Handler
    const handleApprove = async (data: { orderId: string }) => {
        try {
            const response = await fetch(`${functionsBaseUrl}/captureOrder`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: data.orderId }),
            });
            const details = await response.json();
            if (!response.ok) throw new Error(details.error || "Capture failed.");
            
            alert(`Payment Successful! Transaction ID: ${details.id}`);
            clearCart();
        } catch (err: any) {
            setErrorMsg(err.message);
        }
    };

    const paypalSession = usePayPalOneTimePaymentSession({
        createOrder: handleCreateOrder,
        onApprove: handleApprove,
        presentationMode: "auto",
        onError: (err) => setErrorMsg("PayPal error occurred."),
    });

    const creditSession = usePayPalCreditOneTimePaymentSession({
        createOrder: handleCreateOrder,
        onApprove: handleApprove,
        presentationMode: "auto",
        onError: (err) => setErrorMsg("Credit error occurred."),
    });

    if (loadingStatus === INSTANCE_LOADING_STATE.PENDING) {
        return <div className="text-sm text-gray-500 animate-pulse">Initializing PayPal...</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            <paypal-button 
                onClick={() => paypalSession.handleClick()} 
                disabled={paypalSession.isPending} 
            />
            <paypal-credit-button 
                onClick={() => creditSession.handleClick()} 
                disabled={creditSession.isPending} 
            />
            {errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
        </div>
    );
};

export const FirebasePayPalForm = () => {
    return (
        <PayPalProvider
            clientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""}
            components={["paypal-payments"] as const}
            {...({
                currency: "GBP",
                intent: "capture"
            } as any)}
        >
            <div className="p-4 border rounded-lg bg-white shadow-sm">
                <CustomPayPalButtons />
            </div>
        </PayPalProvider>
    );
};