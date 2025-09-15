import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_Z-1uhQUfD1SJ1CgkpKw9mwK6c2U6xz8",
  authDomain: "ghouraf-521e3.firebaseapp.com",
  projectId: "ghouraf-521e3",
  storageBucket: "ghouraf-521e3.firebasestorage.app",
  messagingSenderId: "726384458818",
  appId: "1:726384458818:web:413289761e400c4121c1db"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
