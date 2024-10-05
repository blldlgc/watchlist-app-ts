// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBguAsQO61utz4ESUM2Lv5dPpas7yw3VV4",
  authDomain: "watchlist-together.firebaseapp.com",
  projectId: "watchlist-together",
  storageBucket: "watchlist-together.appspot.com",
  messagingSenderId: "880089130275",
  appId: "1:880089130275:web:6c542e2c4e71b7f6fdd896",
  measurementId: "G-TX92XK1V1S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
