// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7Tfv5w6nW4-u1k1-lIgq3-3srDRot118",
  authDomain: "greivance-f0f33.firebaseapp.com",
  projectId: "greivance-f0f33",
  storageBucket: "greivance-f0f33.firebasestorage.app",
  messagingSenderId: "819274170726",
  appId: "1:819274170726:web:548f60aaeed2776eb248a7",
  measurementId: "G-7X5N11J1V6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); 

export { db, auth, storage, analytics };