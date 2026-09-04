// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-e0b83.firebaseapp.com",
  projectId: "cortexai-e0b83",
  storageBucket: "cortexai-e0b83.firebasestorage.app",
  messagingSenderId: "223285874349",
  appId: "1:223285874349:web:55a3a431fc8940e183c024",
  measurementId: "G-GKFWM0CQ18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth=getAuth(app);
export const googleProvider=new GoogleAuthProvider();

export const githubProvider=new GithubAuthProvider();
