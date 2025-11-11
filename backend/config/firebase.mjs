
import admin from "firebase-admin";
import fs from "fs";

if (!admin.apps.length) {
const serviceAccount = JSON.parse(
  fs.readFileSync(new URL("../serviceAccountKey.json", import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
}

export const authAdmin = admin.auth();
export const dbAdmin = admin.firestore();
export const messagingAdmin = admin.messaging();
export default admin;