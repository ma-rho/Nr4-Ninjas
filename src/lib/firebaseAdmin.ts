import admin from 'firebase-admin';

// When running in a Google Cloud environment like App Hosting, the Admin SDK
// automatically discovers and uses the project's service account credentials.
// This is called Application Default Credentials (ADC).
// We no longer need to manually pass the projectId, clientEmail, or privateKey.

const firebaseAdminConfig = {
  // We still need to provide the storage bucket for Storage operations.
  // This value should be available from the NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET secret.
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

if (!admin.apps.length) {
  try {
    // Initialize the app using ADC.
    admin.initializeApp(firebaseAdminConfig);
  } catch (error) {
    console.error('Firebase admin initialization error with ADC:', error);
    // Log the config being used, for debugging. Do not log private keys in production.
    console.log('Attempted config:', firebaseAdminConfig);
  }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
