// firebaseClient.ts
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/database";
import { getDatabase, ref, push, set } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyABaK5WT22KZSLMX_Zl_2YTOZWlR02hOPk",
    authDomain: "teacher-next.firebaseapp.com",
    projectId: "teacher-next",
    storageBucket: "teacher-next.appspot.com",
    messagingSenderId: "711040975445",
    appId: "1:711040975445:web:016c0fbed20acb4dc3cadc",
    measurementId: "G-1XB436S5S4",
    databaseURL:
        "https://teacher-next-default-rtdb.europe-west1.firebasedatabase.app/",
};

let app;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
}

const uiConfig = {
    signInFlow: "popup",
    signInSuccessUrl: "/",
    tosUrl: "/terms-of-service",
    privacyPolicyUrl: "/privacy-policy",
    signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
};

const database = getDatabase(app);
const auth = firebase.auth();
const ui = uiConfig;
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export { database, auth, ui, googleAuthProvider, ref, push, set };
export default firebase;
