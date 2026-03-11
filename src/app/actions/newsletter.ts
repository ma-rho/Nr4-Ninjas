'use server';

import { adminDb } from "@/lib/firebaseAdmin";

// This server action handles newsletter signups.
// It uses the email as the document ID to prevent duplicates and avoid a separate read operation.

export async function subscribeToNewsletter(email: string) {
  if (!email) {
    throw new Error("Email is required.");
  }

  try {
    const subscriptionRef = adminDb.collection("newsletter_subscriptions").doc(email);

    // Use set with merge: true to create or update the document.
    // This is more efficient than checking for existence first.
    await subscriptionRef.set({
      email: email,
      subscribedAt: new Date(),
    }, { merge: true }); // Using merge: true will update the document if it exists.

    return { message: "Successfully subscribed! You\'re on the list." };

  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    // Provide a more specific error message for the client.
    throw new Error("Could not subscribe. Please try again later.");
  }
}
