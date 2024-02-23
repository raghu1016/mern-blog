// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-91184.firebaseapp.com",
  projectId: "mern-blog-91184",
  storageBucket: "mern-blog-91184.appspot.com",
  messagingSenderId: "132575347725",
  appId: "1:132575347725:web:47616efeac673e4c940144"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);