// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCfwy-6vxiW2B4mZQXS7lQhhhIV2O961NM",
    authDomain: "feeding-scheduler.firebaseapp.com",
    projectId: "feeding-scheduler",
    storageBucket: "feeding-scheduler.firebasestorage.app",
    messagingSenderId: "913020637951",
    appId: "1:913020637951:web:00fe81101bc6e745bb72ca",
    measurementId: "G-M6V7PNTSSP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
