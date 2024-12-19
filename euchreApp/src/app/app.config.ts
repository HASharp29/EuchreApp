import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Import Firestore from Firebase SDK

const firebaseConfig = {
  apiKey: "AIzaSyDI8i2d4G1OC4Ltrl0cUi6Ehc24iO70u2g",
  authDomain: "lexemwellioeuchre.firebaseapp.com",
  projectId: "lexemwellioeuchre",
  storageBucket: "lexemwellioeuchre.firebasestorage.app",
  messagingSenderId: "1049627732366",
  appId: "1:1049627732366:web:6351868a4acf1ff6db5cdf",
  measurementId: "G-S0NWEGVVV2"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()), provideAnimationsAsync() // Providing Firestore
  ]
};
