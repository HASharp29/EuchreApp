import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDI8i2d4G1OC4Ltrl0cUi6Ehc24iO70u2g",
  authDomain: "lexemwellioeuchre.firebaseapp.com",
  projectId: "lexemwellioeuchre",
  storageBucket: "lexemwellioeuchre.firebasestorage.app",
  messagingSenderId: "1049627732366",
  appId: "1:1049627732366:web:6351868a4acf1ff6db5cdf",
  measurementId: "G-S0NWEGVVV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
