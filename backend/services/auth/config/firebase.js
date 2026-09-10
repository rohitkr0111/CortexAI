import { cert, initializeApp } from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "{}");

if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is missing or incomplete");
}

export const app = initializeApp({
  credential: cert(serviceAccount)
});
