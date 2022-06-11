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
  doc,
  getDocs,
  addDoc,
  setDoc,
} from 'firebase/firestore';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../database/firestore";

export default function UserLoginScreen({ navigation }) {
  let [ email, setEmail ] = useState('');
  let [ pw, setPw ] = useState('');

  let [ emailChecked, setEmailChecked ] = useState(false);
  let [ pwChecked, setPwChecked ] = useState(false);

  const renderWarning = (input, inputChecked) => {
    if (!inputChecked) {
      return null;
    } else {
      if (!input) {
        return ( <Text style={ styles.warning }>Required input cannot be empty!</Text> )
      }
    }
  };

  const handleInputsValidation = () => {
    const requiredInputs = [email, pw];
    if (requiredInputs.every((input) => input.trim().length !== 0)) {
      handleLogin();
    }
  };

  function handleLogin() {
    signInWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(`User logged in: ${user.email}`);
        console.log(`User logged in: ${user.uid}`);
        handleNav();
      })
      .catch((authErr) => {
        console.log(authErr.code, '\n', authErr.message);
      });
  };

  const handleNav = () => {
    navigation.navigate('userAuthed');
  };

  return (
    <View>
      <Text style={ {padding: 10} } >User Login Here</Text>

      <Text>Email *  { renderWarning(email, emailChecked) }</Text>
      <TextInput
        style = { styles.input }
        label='Email here'
        keyboardType="email-address"
        onChangeText={ newText => setEmail(newText.trim()) }
        onBlur={ () => setEmailChecked(true) }
      />

      <Text>Password *  { renderWarning(pw, pwChecked) }</Text>
      <TextInput
        style = { styles.input }
        label='Password here'
        keyboardType="email-address"
        secureTextEntry={ true }
        onChangeText={ newText => setPw(newText) }
        onBlur={ () => setPwChecked(true) }
      />

      <TouchableOpacity 
        style={ styles.button }
        onPress={ handleInputsValidation }
      >
        <Text style={ styles.buttonText } >LOG IN</Text>
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
    marginBottom: 10,
  },

  warning: {
    color: "red",
  },

  button: {
    elevation: 8,
    backgroundColor: "#456789",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 10,
  },

  buttonText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});