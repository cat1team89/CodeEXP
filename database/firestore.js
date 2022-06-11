import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { firebaseConfig } from './dbconfig';

export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore(firebase);

const auth = getAuth(firebase);
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Persistence has been set to browserSession");
  })
  .catch((err) => {
    console.error(err);
  });
export { auth };


