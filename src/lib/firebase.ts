
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyDm5Qb4vInsk1h_yd-ptOFNGkYAo4wvnz4",
  authDomain: "slow-down-auth.firebaseapp.com",
  projectId: "slow-down-auth",
  storageBucket: "slow-down-auth.appspot.com",
  messagingSenderId: "728406193863",
  appId: "1:728406193863:web:403d09f9232022473bb0e2",
  measurementId: "G-B1NGEX8V3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export default app;
