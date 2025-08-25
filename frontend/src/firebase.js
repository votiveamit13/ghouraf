import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_Z-1uhQUfD1SJ1CgkpKw9mwK6c2U6xz8",
  authDomain: "ghouraf-521e3.firebaseapp.com",
  projectId: "ghouraf-521e3",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
