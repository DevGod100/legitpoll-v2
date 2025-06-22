import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, TwitterAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL4QiqeE88nMM nevm2Pz_tf5vYnpUjJ1w",
  authDomain: "legitpoll-v2.firebaseapp.com",
  projectId: "legitpoll-v2",
  storageBucket: "legitpoll-v2.firebasestorage.app",
  messagingSenderId: "1056447604823",
  appId: "1:1056447604823:web:81cb91e4cf7af5b9315b12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const twitterProvider = new TwitterAuthProvider();

export default app;