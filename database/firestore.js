import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from './dbconfig';

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);
