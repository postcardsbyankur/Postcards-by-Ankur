import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDfVBonPN_tG0Q1bWM5bVghpZ2t58PuOIE",
  authDomain: "postcardsbyankur-9e848.firebaseapp.com",
  projectId: "postcardsbyankur-9e848",
  storageBucket: "postcardsbyankur-9e848.firebasestorage.app",
  messagingSenderId: "803298899565",
  appId: "1:803298899565:web:042a3b504152d6e764f164",
  measurementId: "G-H9K15BNRK8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
const storage = getStorage(app);

export { db, auth, googleProvider, storage };
