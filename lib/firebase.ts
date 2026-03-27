import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAd1ipxfSitA68lnhXoGqUxN0BzrSLAnw",
  authDomain: "yasin-protfolio.firebaseapp.com",
  projectId: "yasin-protfolio",
  storageBucket: "yasin-protfolio.firebasestorage.app",
  messagingSenderId: "679950178277",
  appId: "1:679950178277:web:59276d196d4ec4ea5f010c",
  measurementId: "G-XP7Q8N3MFQ"
};

// Initialize Firebase securely for Next.js (prevent re-initializing during hot reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
