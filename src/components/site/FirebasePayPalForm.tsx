'use client';

import { useEffect, useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { app } from '@/lib/firebase';

const FIREBASE_REGION = process.env.NEXT_PUBLIC_FIREBASE_REGION || 'us-central1';
// Use the project ID from the initialized app for better reliability
const FIREBASE_PROJECT_ID = app.options.projectId || '';

const functionsBaseUrl = `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;

export const FirebasePayPalForm = () => {
    const { cart, clearCart } = useCart();
    const [{ isResolved }] = usePayPalScriptReducer();
    const [error, setError] = useState<string | null>(null);
    const [isCardEligible, setIsCardEligible] = useState(false);

    const cardFieldsRef = useRef<any>(null);

    useEffect(() => {
        if (isResolved && window.paypal && window.paypal.CardFields) {
            if (cardFieldsRef.current) return;

            const cardField = window.paypal.CardFields({
                createOrder: async () => {
                    try {
                        setError(null);
                        
                        if (!FIREBASE_PROJECT_ID) {
                            throw new Error("Firebase Project ID is not configured. Please check your environment variables.");
                        }

                        const response = await fetch(`${functionsBaseUrl}/createOrder`, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ cart }),
                        });
                        
                        if (!response.ok) {
                            const data = await response.json();
                            throw new Error(data.error || "Failed to create order.");
                        }
                        
                        const data = await response.json();
                        return data.id;
                    } catch (err: any) {
                        console.error("Create Order Error:", err);
                        setError(err.message || "Could not connect to payment server.");
                        throw err;
                    }
                },
                onApprove: async (data) => {
                    try {
                        const response = await fetch(`${functionsBaseUrl}/captureOrder`, {
                            method: "POST",
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ orderID: data.orderID }),
                        });
                        
                        if (!response.ok) {
                            const details = await response.json();
                            throw new Error(details.error || "Failed to capture payment.");
                        }

                        const details = await response.json();
                        alert(`Transaction completed by ${details.payer.name.given_name}`);
                        clearCart();
                    } catch (err: any) {
                        console.error("Capture Order Error:", err);
                        setError(err.message || "Payment capture failed.");
                    }
                },
                onError: (err: any) => {
                    console.error("PayPal CardFields Error:", err);
                    setError("An error occurred with the card fields. Please refresh and try again.");
                }
            });
            
            cardFieldsRef.current = cardField;

            if (cardField.isEligible()) {
                setIsCardEligible(true);
            } else {
                setIsCardEligible(false);
            }
        }
    }, [isResolved, cart, clearCart]);

    useEffect(() => {
        if (isCardEligible && cardFieldsRef.current) {
            const cardField = cardFieldsRef.current;

            cardField.NumberField({}).render("#card-number-container");
            cardField.CVVField({}).render("#card-cvv-container");
            cardField.ExpiryField({}).render("#card-expiry-container");

            const button = document.getElementById("card-button");
            const clickListener = () => {
                cardField.submit().catch((err: any) => {
                    console.error("Validation Error:", err);
                    setError("Please check your card details.");
                });
            };
            
            button?.addEventListener("click", clickListener);

            return () => {
                button?.removeEventListener("click", clickListener);
            };
        }
    }, [isCardEligible]);

    if (!isResolved) {
        return <div className="text-center p-4 text-sm text-muted-foreground italic">Initializing secure checkout...</div>;
    }

    return (
        <div id="card-form" className="space-y-4">
            {isCardEligible ? (
                <>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Card Number</label>
                            <div id="card-number-container" className="p-3 border rounded-xl bg-white h-11"></div>
                        </div>

                        <div className="flex space-x-4">
                            <div className="w-1/2 space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Expiry Date</label>
                                <div id="card-expiry-container" className="p-3 border rounded-xl bg-white h-11"></div>
                            </div>
                            <div className="w-1/2 space-y-1.5">
                                <label className="text-[10px] uppercase font-bold text-white/40 tracking-widest">CVV</label>
                                <div id="card-cvv-container" className="p-3 border rounded-xl bg-white h-11"></div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs text-center font-medium">
                            {error}
                        </div>
                    )}

                    <Button id="card-button" type="button" className="w-full h-12 rounded-full font-black uppercase tracking-widest text-xs">
                        Pay with Card
                    </Button>
                </>
            ) : (
                <div className="p-4 bg-muted rounded-xl text-center">
                    <p className="text-sm text-muted-foreground">Direct card entry is unavailable. Please use the PayPal button above.</p>
                </div>
            )}
        </div>
    );
};
