// firebaseAdmin.ts

import * as admin from "firebase-admin";
import { config } from "dotenv";

config(); // Load environment variables from .env.local

const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL:
            "https://teacher-next-default-rtdb.europe-west1.firebasedatabase.app/",
    });
}

export default admin;
