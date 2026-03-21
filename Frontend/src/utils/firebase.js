// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "loginvirtualcourses-94ff6.firebaseapp.com",
  projectId: "loginvirtualcourses-94ff6",
  storageBucket: "loginvirtualcourses-94ff6.firebasestorage.app",
  messagingSenderId: "1070109129496",
  appId: "1:1070109129496:web:1224bbfd80605f9d5ffc6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };