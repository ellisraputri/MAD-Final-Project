import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

// In ES Modules, we sometimes need to manually load JSON
const serviceAccount = JSON.parse(
  await readFile(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth(); // If you plan to use Firebase Auth

export { db, auth, admin };