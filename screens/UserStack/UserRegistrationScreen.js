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
import { Picker } from '@react-native-picker/picker';
import { auth, db, storage } from "../../database/firestore";
import { ARMY_CAMPS } from '../../util/SAF-Info';

export default function UserRegistrationScreen({ navigation }) {
  let [ fname, setFname ] = useState('');
  let [ lname, setLname ] = useState('');
  let [ email, setEmail ] = useState('');
  let [ pw, setPw ] = useState('');
  let [ photoStr, setPhotoStr ] = useState(null);
  let [ photoUri, setPhotoUri ] = useState('');
  let [ bio, setBio ] = useState('');

  let [ signUpErr, setSignUpErr ] = useState('');
  
  let [ selectedCamp, setSelectedCamp ] = useState(ARMY_CAMPS[0]);
  
  let [ hasEmptyField, setHasEmptyField ] = useState(false);
  
  const renderEmptyFieldWarning = () => {
    if (hasEmptyField) {
      return ( <Text style={ styles.warning }>Required fields cannot be empty!</Text> )
    } else {
      return null;
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

  const renderResetImageButton = () => {
    if (photoUri) {
      return (
        <TouchableOpacity 
          onPress={ handleResetImage } 
          style={{ width: '40%', alignSelf: 'center' }}
        >
          <Text style={ styles.smallButton }>Reset</Text>
        </TouchableOpacity>
      )
    } else {
      return null;
    }
  };

  const renderPicker = () => {
    let campItems = ARMY_CAMPS.map((camp) => {
      return (<Picker.Item key={ camp } label={ camp } value={ camp } />)
    });
    return (
      <Picker
        selectedValue={ selectedCamp }
        onValueChange={(itemValue, itemIndex) => {
          handlePickCamp(itemValue);
        }}
        style={{ width: '60%', alignSelf: 'center' }}
      >
        { campItems }
      </Picker>
    )
  };

  const handlePickCamp = (itemValue) => {
    console.log(`itemValue: ${itemValue}`);
    setSelectedCamp(itemValue);
  };

  const handleCheckNotEmpty = (field) => {
    if (!field) {
      setHasEmptyField(true);
    } else {
      setHasEmptyField(false);
    }
  };

  const handleInputsValidation = () => {
    const requiredInputs = [fname, lname, email, pw, selectedCamp];
    if (requiredInputs.every((input) => input.trim().length !== 0)) {
      handleSignUp();
    } else {
      setHasEmptyField(true);
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

  const handleResetImage = () => {
    setPhotoStr(null);
    setPhotoUri('');
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
      console.log(fname, lname, bio, selectedCamp)
      await setDoc(doc(db, "user", email), {
        uFirstname: fname,
        uLastname: lname,
        uBio: (bio.length !== 0) ? bio : 'No bio',
        uCamp: selectedCamp,
        uPicPath: photoStr ? `profilepics/${email}` : null,  // `profilepics/` is directory in Firebase storage
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
    <View style={ styles.mainContainer }>
      { renderEmptyFieldWarning() }

      <View style={ styles.entry } >
        <Text
          style={ (!hasEmptyField || fname) ? styles.textPrompt : styles.textPromptWarn }
        >First Name *</Text>
        <TextInput
          style={ styles.input }
          placeholder='First name here'
          autoCapitalize='words'
          onChangeText={ newText => setFname(newText.trim()) }
          onBlur={ () => handleCheckNotEmpty(fname) }
        />
      </View>

      <View style={ styles.entry } >
        <Text
          style={ (!hasEmptyField || lname) ? styles.textPrompt : styles.textPromptWarn }
        >Last Name * </Text>
        <TextInput
          style={ styles.input }
          placeholder='Last name here'
          autoCapitalize='words'
          onChangeText={ newText => setLname(newText.trim()) }
          onBlur={ () => handleCheckNotEmpty(lname) }
        />
      </View>

      <View style={ styles.entry } >
        <Text
          style={ (!hasEmptyField || email) ? styles.textPrompt : styles.textPromptWarn }
        >Email * </Text>
        <TextInput
          style={ styles.input }
          placeholder='Email here'
          keyboardType="email-address"
          onChangeText={ newText => setEmail(newText.trim()) }
          onBlur={ () => handleCheckNotEmpty(email) }
        />
      </View>

      <View style={ styles.entry } >
        <Text
          style={ (!hasEmptyField || pw) ? styles.textPrompt : styles.textPromptWarn }
        >Password * </Text>
        <TextInput
          style={ styles.input }
          placeholder='Password here'
          secureTextEntry={ true }
          onChangeText={ newText => setPw(newText) }
          onBlur={ () => handleCheckNotEmpty(pw) }
        />
      </View>

      <View style={ styles.entry } >
        <Text 
          style={ (!hasEmptyField || selectedCamp) ? styles.textPrompt : styles.textPromptWarn }
        >Camp * </Text>
        <View style={ styles.dropdownInput } >
          { renderPicker() }
        </View>
      </View>

      <View style={ styles.entry } >
        <Text style={ styles.textPrompt } >Profile Picture </Text>
        <TouchableOpacity 
          onPress={ handlePickImage } 
          style={ styles.imageInput }
        >
          <Text style={ styles.smallButton }>Choose from Gallery</Text>
        </TouchableOpacity>

      </View>
      { renderResetImageButton() }
      { renderImagePreview() }

      <View style={ styles.entry } >
        <Text style={ styles.textPrompt } >Bio </Text>
        <TextInput
          style={ styles.multilineInput }
          multiline={ true }
          placeholder='Say something about yourself :)'
          onChangeText={ newText => setBio(newText) }
        />
      </View>

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
  mainContainer: {
    flex: 1,
    marginHorizontal: '5%',
    marginTop: '10%',
  },

  entry: {
    flexDirection: 'row',
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },

  textPrompt: {
    flex: 0.25,
    // textAlign: 'right',
    padding: 10,
    marginRight: 5,
    fontSize: 16,
  },

  textPromptWarn: {
    flex: 0.25,
    // textAlign: 'right',
    padding: 10,
    marginRight: 5,
    color: 'red',
    fontSize: 16,
  },

  input: {
    flex: 0.75,
    borderColor: "gray",
    // width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    maxLength: 30,
  },

  dropdownInput : {
    flex: 0.75,
    borderColor: "gray",
    // width: "100%",
    padding: 10,
  },

  imageInput : {
    flex: 0.75,
    alignSelf: 'center',
  },

  multilineInput: {
    flex: 0.75,
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    numberOfLines: 3,
  },

  warning: {
    alignSelf: 'center',
    fontSize: 15,
    color: "red",
    marginBottom: 10,
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

  smallButton: {
    textAlign: 'center', 
    borderWidth: 3,
    borderColor: 'grey',
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