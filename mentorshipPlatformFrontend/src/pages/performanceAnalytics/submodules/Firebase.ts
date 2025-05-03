import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCvoF08OK9QA2BrLf3Osm63FUi9rdX3yx4",
    authDomain: "interviewprep-2404b.firebaseapp.com",
    projectId: "interviewprep-2404b",
    storageBucket: "interviewprep-2404b.firebasestorage.app",
    messagingSenderId: "989717230232",
    appId: "1:989717230232:web:8e03171c869c710c9a96ed",
    measurementId: "G-BYTP4QSHRC"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
