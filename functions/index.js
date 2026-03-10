"use server";

import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia", // Always use the latest API version
});

export async function createStripeCheckout(cartItems) {
  const origin = (await headers()).get("origin");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents/pence
        },
        quantity: item.quantity,
      })),
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
    });

    return { url: session.url };
  } catch (error) {
    console.error("Stripe Error:", error.message);
    throw new Error("Could not create checkout session");
  }
}

// --- Event Newsletter Function (Firestore-triggered) ---

/**
 * Sends a newsletter email to all subscribers when a new event is created.
 */
exports.sendEventNewsletter = functions.firestore
  .document("events/{eventId}")
  .onCreate(async (snapshot) => {
    const eventData = snapshot.data();

    if (!eventData) {
      console.log("No data associated with the event.");
      return null;
    }

    try {
      // 1. Get all newsletter subscribers
      const subscribersSnapshot = await db.collection("newsletter_subscriptions").get();
      if (subscribersSnapshot.empty) {
        console.log("No subscribers found.");
        return null;
      }

      const subscribers = subscribersSnapshot.docs.map(doc => doc.data().email).filter(email => !!email);

      if (subscribers.length === 0) {
        console.log("Subscriber list is empty or contains no valid emails.");
        return null;
      }

      // 2. Add an email document to the 'mail' collection for each subscriber.
      // The "Trigger Email" extension will then detect these and send the actual emails.
      const mailCollection = db.collection("mail");

      const emailPromises = subscribers.map(email => {
        return mailCollection.add({
          to: [email],
          message: {
            subject: `New Event Alert: ${eventData.name}`,
            html: `
              <h1>A new event has been announced!</h1>
              <h2>${eventData.name}</h2>
              <p><b>Date:</b> ${new Date(eventData.date.seconds * 1000).toLocaleDateString()}</p>
              <p><b>Venue:</b> ${eventData.venue}</p>
              <p>${eventData.description}</p>
              <p>Don't miss out! Get more details on our website.</p>
              <p><em>- The NR4 Ninjas Team</em></p>
            `,
          },
        });
      });

      await Promise.all(emailPromises);
      console.log(`Successfully queued emails for ${subscribers.length} subscribers.`);
      return null;

    } catch (error) {
      console.error("Error sending event newsletter:", error);
      return null;
    }
  });