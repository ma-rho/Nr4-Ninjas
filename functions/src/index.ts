import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize the Firebase Admin SDK.
admin.initializeApp();

const db = admin.firestore();

/**
 * Sends a newsletter email to all subscribers when a new event is created.
 */
export const sendEventNewsletter = functions.firestore
  .document("events/{eventId}")
  .onCreate(async (snapshot) => {
    const eventData = snapshot.data();

    if (!eventData) {
      console.log("No data associated with the event.");
      return;
    }

    try {
      // 1. Get all newsletter subscribers
      const subscribersSnapshot = await db.collection("newsletter_subscriptions").get();
      if (subscribersSnapshot.empty) {
        console.log("No subscribers found.");
        return;
      }

      const subscribers = subscribersSnapshot.docs.map(doc => doc.data().email).filter(email => !!email);

      if (subscribers.length === 0) {
        console.log("Subscriber list is empty or contains no valid emails.");
        return;
      }

      // 2. Create a new email document for each subscriber
      // The "Trigger Email" extension will then send the emails.
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

    } catch (error) {
      console.error("Error sending event newsletter:", error);
    }
  });
