'use server';

import { adminDb } from "@/lib/firebaseAdmin";

async function getPhotos() {
  const photosCollection = await adminDb.collection('photos').orderBy('createdAt', 'desc').get();
  const photos = photosCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; url: string; createdAt: string }[];
  return photos;
}

export { getPhotos };
