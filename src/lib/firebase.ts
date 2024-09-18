import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9mrJnkOuizBYCYJMtdysn-bIpLuQGQgE",
  authDomain: "medi-link-sanni.firebaseapp.com",
  projectId: "medi-link-sanni",
  storageBucket: "medi-link-sanni.appspot.com",
  messagingSenderId: "384798897435",
  appId: "1:384798897435:web:aec13e49beb8be9e208fbe"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);