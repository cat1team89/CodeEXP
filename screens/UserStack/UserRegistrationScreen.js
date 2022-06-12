import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  doc,
  setDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadString } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from "../../database/firestore";


export default function UserRegistrationScreen({ navigation }) {
  let [ fname, setFname ] = useState('');
  let [ lname, setLname ] = useState('');
  let [ email, setEmail ] = useState('');
  let [ pw, setPw ] = useState('');
  let [ photoStr, setPhotoStr ] = useState(null);
  let [ photoUri, setPhotoUri ] = useState('');

  let [ fnameChecked, setFnameChecked ] = useState(false);
  let [ lnameChecked, setLnameChecked ] = useState(false);
  let [ emailChecked, setEmailChecked ] = useState(false);
  let [ pwChecked, setPwChecked ] = useState(false);

  let [ signUpErr, setSignUpErr ] = useState('');

  const renderWarning = (input, inputChecked) => {
    if (!inputChecked) {
      return null;
    } else {
      if (!input) {
        return ( <Text style={ styles.warning }>Required input cannot be empty!</Text> )
      }
    }
  };

  const renderSignUpErr = () => {
    if (signUpErr) {
      return (
        <Text>{ signUpErr }</Text>
      );
    } else {
      return null;
    }
  };

  const renderImagePreview = () => {
    if (photoUri) {
      return (
        <Image 
            defaultSource={ photoUri }
            source={ photoUri } 
            resizeMode='contain'
            style={ styles.imagePreview }
          />
      )
    } else {
      return null;
    }
  };

  const handleInputsValidation = () => {
    const requiredInputs = [fname, lname, email, pw];
    if (requiredInputs.every((input) => input.trim().length !== 0)) {
      handleSignUp();
    }
  };

  const handlePickImage = () => {
    let options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
    };
    ImagePicker.launchImageLibraryAsync(options)
      .then((result) => {
        console.log('result = ', result);
        if (result.cancelled === true) {
          console.log('User cancelled image picker');
        } else {
          setPhotoStr(result.base64);
          setPhotoUri(result.uri);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  async function handleSignUp() {
    createUserWithEmailAndPassword(auth, email, pw)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(`User registered: ${user.email}`);
        console.log(`User registered: ${user.uid}`);
        addUserToDB(user.email)
          .then(() => {
            handleNav();
          })
          .catch((err) => {
            console.log('Failed to add user info');
            console.error(err);
          });
        if (photoStr) {
          addUserPhoto(user.email);
        }
      })
      .catch((authErr) => {
        console.log(authErr.code, '\n', authErr.message);
        setSignUpErr(authErr.code);
      });
  };

  async function addUserToDB(email) {
    try {
      const ref = await setDoc(doc(db, "user", email), {
        uFirstname: fname,
        uLastname: lname,
        uBio: 'No bio',
        uPicPath: `profilepics/${email}`,
      });
      console.log("User added with email: ", email);
    } catch (err) {
      console.error("Error adding user: ", err);
    }
  };

  async function addUserPhoto(email) {
    const storageRef = ref(storage, `profilepics/${email}`);
    uploadString(storageRef, photoStr, 'base64')
      .then((snapshot) => {
        console.log(`Uploaded base64 str for : ${email}`);
      });
  };

  const handleNav = () => {
    navigation.navigate('userAuthed');
  };

  return (
    <View>
      <Text style={ {padding: 10} } >User Register Here</Text>

      <Text>First Name * { renderWarning(fname, fnameChecked) }</Text>
      <TextInput
        style = { styles.input }
        label='First name here'
        autoCapitalize='words'
        onChangeText={ newText => setFname(newText.trim()) }
        onBlur={ () => setFnameChecked(true) }
      />

      <Text>Last Name * { renderWarning(lname, lnameChecked) }</Text>
      <TextInput
        style = { styles.input }
        label='Last name here'
        autoCapitalize='words'
        onChangeText={ newText => setLname(newText.trim()) }
        onBlur={ () => setLnameChecked(true) }
      />

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
        secureTextEntry={ true }
        onChangeText={ newText => setPw(newText) }
        onBlur={ () => setPwChecked(true) }
      />

      <Text>You can choose to add a profile picture</Text>
      <TouchableOpacity 
        onPress={ handlePickImage } 
        style={{ width: '40%', alignSelf: 'center' }}
      >
        <Text style={{
          textAlign: 'center', 
          borderWidth: 3,
          borderColor: 'grey',
        }}>Choose from gallery</Text>
      </TouchableOpacity>
      {/* <Text>Or Use a base64 string { ':\'\(' }</Text>
      <TextInput
        style = { styles.input }
        label='base64 string'
        onChangeText={ newText => setPhotoStr(newText) }
      /> */}
      { renderImagePreview() }

      <Text style={ styles.warning }>{ renderSignUpErr() }</Text>

      <TouchableOpacity 
        style={ styles.button }
        onPress={ handleInputsValidation }
      >
        <Text style={ styles.buttonText } >SIGN UP</Text>
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

  imagePreview: {
    alignSelf: 'center',
    aspectRatio: '1/1',
    width: '30%',
    borderColor: 'grey',
    borderWidth: 5,
    borderRadius: '100%',
  },
});