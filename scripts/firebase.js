import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpzZ4lonWGZbmVGhZ9pzBFgbSAQdLGahA",
    authDomain: "vouquerer-a1daf.firebaseapp.com",
    projectId: "vouquerer-a1daf",
    storageBucket: "vouquerer-a1daf.firebasestorage.app",
    messagingSenderId: "1020131397441",
    appId: "1:1020131397441:web:1ff8e64ea813ce19139bc0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
