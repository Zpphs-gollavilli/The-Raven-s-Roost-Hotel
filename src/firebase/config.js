import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics"; // if you are using Analytics
// import { getAuth } from "firebase/auth"; // if you are using Authentication
// ... other Firebase services you might need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize other services if you need them
// const analytics = getAnalytics(app);
// const auth = getAuth(app);

// Export the app instance and any other services you've initialized
export default app;