import Stripe from "stripe";

// This file is NOT a Server Action file, so we can export the client instance.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});
