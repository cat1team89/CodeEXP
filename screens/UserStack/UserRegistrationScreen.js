import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../database/firestore";


export default function UserRegistrationScreen() {
  let [ uFname, setFname ] = useState('');
  let [ uLname, setLname ] = useState('');
  let [ uEmail, setEmail ] = useState('');
  let [ uPw, setPw ] = useState('');

  const validateInputs = () => {

  }

  // useEffect(()=> {}, []);
  const signUp = () => {
    createUserWithEmailAndPassword(auth, uEmail, uPw)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(`User registered: ${user}`);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, '\n', errorMessage);
      });
  }

  return (
    <View>
      <Text style={ {padding: 10} } >User Register Here</Text>

      <Text>First Name</Text>
      <TextInput
        style = { styles.input }
        label='First name here'
        autoCapitalize='words'
        autoFocus={ true }
        onSubmitEditing={ () => {console.log(`Input submitted`)} }
      />

      <Text>Last Name</Text>
      <TextInput
        style = { styles.input }
        label='Last name here'
        autoCapitalize='words'
        onSubmitEditing={ () => {console.log(`Input submitted`)} }
      />

      <Text>Email</Text>
      <TextInput
        style = { styles.input }
        label='Email here'
        keyboardType="email-address"
        onChangeText={newText => setEmail(newText)}
        onSubmitEditing={ () => {console.log(`Input submitted`)} }
      />

      <Text>Password</Text>
      <TextInput
        style = { styles.input }
        label='Password here'
        keyboardType="email-address"
        secureTextEntry={ true }
        onChangeText={newText => setPw(newText)}
        onSubmitEditing={ () => {console.log(`Input submitted`)} }
      />

      <TouchableOpacity onPress={ signUp }>
        <Text>{'\n\n'}SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
});