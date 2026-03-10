import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we are in a browser environment or if the API key is present
// This prevents initialization errors during the Next.js build phase
const isConfigured = typeof window !== "undefined" || !!firebaseConfig.apiKey;

const app = isConfigured 
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : (null as any);

const auth = isConfigured ? getAuth(app) : (null as any);
const db = isConfigured ? getFirestore(app) : (null as any);
const storage = isConfigured ? getStorage(app) : (null as any);
const functions = isConfigured ? getFunctions(app) : (null as any);

export { app, auth, db, storage, functions };