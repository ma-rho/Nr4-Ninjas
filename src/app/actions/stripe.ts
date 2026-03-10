'use server';

import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe'; // Correct: Import from the new central file

export async function createCheckoutSession(cartItems: any[]) {
  const headerList = await headers();
  const origin = headerList.get('origin');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cartItems.map(item => ({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: item.name,
            images: [item.imageUrl],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      invoice_creation: {
        enabled: true,
      },
      customer_creation: 'always',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    throw new Error(error.message);
  }
}
