import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDuZmYBSeSFOmgbFf71x9OxnFPDtir1wnA",
  authDomain: "chatboard-3000.firebaseapp.com",
  projectId: "chatboard-3000",
  storageBucket: "chatboard-3000.appspot.com",
  messagingSenderId: "79156239579",
  appId: "1:79156239579:web:ae249a142cacb7cd1000fe",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "southamerica-east1");
export const messaging = getMessaging(app);

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export const google = new GoogleAuthProvider();
