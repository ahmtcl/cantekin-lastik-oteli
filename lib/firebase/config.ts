import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only on client-side with valid config
function initializeFirebase() {
  if (typeof window === "undefined") {
    // Return null during SSR/build
    console.log("Firebase init skipped: SSR environment");
    return null;
  }
  
  if (!firebaseConfig.apiKey) {
    console.error("Firebase config is missing. Check environment variables:", {
      hasApiKey: !!firebaseConfig.apiKey,
      hasAuthDomain: !!firebaseConfig.authDomain,
      hasProjectId: !!firebaseConfig.projectId,
    });
    return null;
  }

  console.log("Initializing Firebase...", {
    projectId: firebaseConfig.projectId,
    hasApiKey: !!firebaseConfig.apiKey,
  });

  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully");
    return app;
  }
  console.log("Using existing Firebase app");
  return getApp();
}

const app = initializeFirebase();

// Export with safety checks
export const auth = app ? getAuth(app) : null as any;
export const db = app ? getFirestore(app) : null as any;
export const analytics = app && typeof window !== "undefined" ? getAnalytics(app) : null;
