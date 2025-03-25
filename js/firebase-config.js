import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDQKm2AKEuZsm7SmXAKakaA6Pactt85pFw",
    authDomain: "zeruel.firebaseapp.com",
    projectId: "zeruel",
    storageBucket: "zeruel.firebasestorage.app",
    messagingSenderId: "329233585998",
    appId: "1:329233585998:web:b7324200f102edbd98f01f",
    measurementId: "G-YLD79PTNNR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
