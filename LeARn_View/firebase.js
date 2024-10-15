// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnAmLenNBvPgIc4NoaNcfeqz1r63Rxfz0",
  authDomain: "learnview-541d3.firebaseapp.com",
  projectId: "learnview-541d3",
  storageBucket: "learnview-541d3.appspot.com",
  messagingSenderId: "602643162375",
  appId: "1:602643162375:web:b8812fd574df4a298311a2",
  measurementId: "G-3BNMXV9T6W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
