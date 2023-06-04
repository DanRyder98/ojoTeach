// src/firebaseConfig.ts
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import firebaseui from "firebaseui";
import "firebase/database"; // If you want to use the Realtime Database
import "firebase/firestore"; // If you want to use Firestore
// import "firebase/auth"; // If you want to use Firebase Authentication

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyABaK5WT22KZSLMX_Zl_2YTOZWlR02hOPk",
    authDomain: "teacher-next.firebaseapp.com",
    projectId: "teacher-next",
    storageBucket: "teacher-next.appspot.com",
    messagingSenderId: "711040975445",
    appId: "1:711040975445:web:016c0fbed20acb4dc3cadc",
    measurementId: "G-1XB436S5S4",
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Initialize the FirebaseUI Widget using Firebase.
const ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start("#firebaseui-auth-container", {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",
    signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // Other config options...
});

const db = getFirestore(app); // If you want to use Firestore
//const db = firebase.firestore(); // If you want to use Firestore
const rtdb = getDatabase(app); // If you want to use Realtime Database
// const rtdb = firebase.database(); // If you want to use Realtime DatabaseAuthentication
// const auth = firebase.auth(); // If you want to use Firebase Authentication

export { db, rtdb, analytics, ui };
