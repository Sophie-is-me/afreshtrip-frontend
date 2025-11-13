// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBM6Htztx2-Vt4J5kvp966KN7lL_Rjy7dM",
  authDomain: "afreshtrip.firebaseapp.com",
  projectId: "afreshtrip",
  storageBucket: "afreshtrip.firebasestorage.app",
  messagingSenderId: "550030138351",
  appId: "1:550030138351:web:de958330ece3ad157a741a",
  measurementId: "G-HWJEQR0BTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();