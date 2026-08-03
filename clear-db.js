import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "invertible-lexicon-tkm1r",
  appId: "1:767533648793:web:82eb8a331d68910e176108",
  apiKey: "AIzaSyB9MSt6QLptRpuIVr3NlRYT0b9c3fIWOHY",
  authDomain: "invertible-lexicon-tkm1r.firebaseapp.com",
  storageBucket: "invertible-lexicon-tkm1r.firebasestorage.app",
  messagingSenderId: "767533648793"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "ai-studio-wandernortheast-5ce7f2c0-c9e0-4b05-9b81-692be019af56");

async function clearItineraries() {
  const querySnapshot = await getDocs(collection(db, "itineraries"));
  for (const document of querySnapshot.docs) {
    await deleteDoc(doc(db, "itineraries", document.id));
  }
  console.log("Cleared itineraries collection.");
  process.exit(0);
}

clearItineraries();
