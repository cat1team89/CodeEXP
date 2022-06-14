import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../database/firestore";

export default function UserLoginScreen({ navigation }) {
  let [ email, setEmail ] = useState('');
  let [ pw, setPw ] = useState('');

  let [ hasEmptyField, setHasEmptyField ] = useState(false);

  const renderEmptyFieldWarning = () => {
    if (hasEmptyField) {
      return ( <Text style={ styles.warning }>Required fields cannot be empty!</Text> )
    } else {
      return null;
    }
  };

  const renderRegisterLink = () => {
    return (
      <View style={{ flexDirection: 'row-reverse', marginRight: '10%' }} >
        <Text style={{ fontSize: 18 }} >
          { 'New to us? Sign up ' }
          <Text 
            style={{ textDecorationLine: 'underline', color: 'blue', fontSize: 18 }} 
            onPress={ () => {navigation.navigate('Register')} }
          >here</Text>
          { '.' }
        </Text>
      </View>
    )
  };

  const renderHelplineLink = () => {
    return (
      <View style={ styles.helpLinkContainer } >
        <Text style={ styles.helpLinkText } >Need some support to keep going?</Text>
        <Text style={ styles.helpLinkText } >
          { 'Tap ' }
          <Text 
            style={ styles.helpLinkClickText }
            onPress={ () => {navigation.navigate('Help Lines')} }
          >here</Text>
          { '.' }
        </Text>
      </View>
    )
  };

  const handleCheckNotEmpty = (field) => {
    if (!field) {
      setHasEmptyField(true);
    } else {
      setHasEmptyField(false);
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
    <View style={ styles.mainContainer }>
      <Image 
        source={ require('../../assets/logo.jpg') } 
        resizeMode='contain'
        style={ styles.logo }
      />

      { renderEmptyFieldWarning() }

      <View style={ styles.entry } >
        <Text
          style={ (!hasEmptyField || email) ? styles.textPrompt : styles.textPromptWarn }
        >Email *</Text>
        <TextInput
          style = { styles.input }
          placeholder='Email here'
          keyboardType="email-address"
          onChangeText={ newText => setEmail(newText.trim()) }
          onBlur={ () => handleCheckNotEmpty(email) }
        />
      </View>

      <View style={ styles.entry } >
        <Text
          style={ (!hasEmptyField || pw) ? styles.textPrompt : styles.textPromptWarn }
        >Password *</Text>
        <TextInput
          style = { styles.input }
          placeholder='Password here'
          secureTextEntry={ true }
          onChangeText={ newText => setPw(newText) }
          onBlur={ () => handleCheckNotEmpty(pw) }
        />
      </View>


      <TouchableOpacity 
        style={ styles.button }
        onPress={ handleInputsValidation }
        >
        <Text style={ styles.buttonText } >LOG IN</Text>
      </TouchableOpacity>

      { renderRegisterLink() }

      { renderHelplineLink() }


    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginHorizontal: '5%',
  },

  logo: {
    alignSelf: 'center',
    aspectRatio: '1/1',
    flex: 0.4,
    borderRadius: 10,
    marginVertical: '5%',
  },

  entry: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  textPrompt: {
    flex: 0.25,
    textAlign: 'right',
    padding: 10,
    marginRight: 5,
    fontSize: 18,
  },

  textPromptWarn: {
    flex: 0.25,
    textAlign: 'right',
    padding: 10,
    marginRight: 5,
    color: 'red',
    fontSize: 16,
  },

  input: {
    flex: 0.75,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
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

  helpLinkContainer: {
    flex: 0.2,
    marginTop: '20%',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#5a792c',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },

  helpLinkText: {
    fontSize: 18,
  },

  helpLinkClickText: {
    fontSize: 18,
    textDecorationLine: 'underline',
    color: 'blue'
  },
});