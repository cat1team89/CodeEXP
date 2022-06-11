import React, {
  useState,
  useEffect, 
  useRef,
} from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
} from 'react-native';
import {
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from "../../database/firestore";

export default function UserAuthedScreen({ navigation }) {
  let [ userDetails, setUserDetails ] = useState({});
  
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log(`User: ${user.email}; ${user.uid}`);
      getUserInfo(user.email)
        .then((userObj) => {setUserDetails(userObj)})
        .catch(err => console.error(err));
    } else {
      handleSignedOut();
    }
  }, []);

  async function getUserInfo(email) {
    const userCollectionRef = collection(db, 'user')
    const userSnap = await getDoc(doc(userCollectionRef, email));
    const data = userSnap.data();
    return {
      email: email,
      fname: data.uFirstname,
      lname: data.uLastname,
      bio: data.uBio,
    };
  };

  // TODO: implement
  const handleSignedOut = () => {
    console.log('user not signed in');
  };


  const renderSignedIn = () => {
    if (userDetails.email) {
      return (
        <View>
          <Text>User Has Signed In</Text>
          <Text>Name: { userDetails.fname } { userDetails.lname }</Text>
          <Text>Bio: { userDetails.bio }</Text>
        </View>
      );
    } else {
      return (
        <Text>User Details Not Fetched</Text>
      );
    }
  }

  return (
    <View>
      { renderSignedIn() }
    </View>
  );
}