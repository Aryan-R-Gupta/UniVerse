
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  "projectId": "studio-1727890966-c50fa",
  "appId": "1:1003263461555:web:e0472de8b3cfb05d8588c6",
  "storageBucket": "studio-1727890966-c50fa.firebasestorage.app",
  "apiKey": "AIzaSyCyDEesgxth0_ORM7gE93FMXytS_KSHLRk",
  "authDomain": "studio-1727890966-c50fa.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "1003263461555"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
