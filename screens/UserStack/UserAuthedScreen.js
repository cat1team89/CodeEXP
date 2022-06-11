import React, {
  useState,
  useEffect, 
  useRef,
} from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from "../../database/firestore";

export default function UserAuthedScreen({ navigation }) {
  let [ userDetails, setUserDetails ] = useState({});
  let [ picUrl, setPicUrl ] = useState('');
  
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log(`User: ${user.email}; ${user.uid}`);
      getUserInfo(user.email)
        .then((userObj) => {setUserDetails(userObj)})
        .catch(err => console.error(err));
    }
  }, []);

  useEffect(() => {
    const picPath = userDetails.picpath;
    if (picPath) {
      const picRef = ref(storage, picPath);
      getDownloadURL(picRef)
        .then((url) => {
          console.log(url);
          setPicUrl(url);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userDetails]);

  async function getUserInfo(email) {
    const userCollectionRef = collection(db, 'user')
    const userSnap = await getDoc(doc(userCollectionRef, email));
    const data = userSnap.data();
    return {
      email: email,
      fname: data.uFirstname,
      lname: data.uLastname,
      bio: data.uBio,
      picpath: data.uPicPath,
    };
  };

  const renderUserInfo = () => {
    if (userDetails.email) {
      return (
        <View style={ styles.userDetailsContainer } >
          <Text style={ styles.name } >{ userDetails.fname } { userDetails.lname }</Text>
          <Text style={ styles.bio } >{ userDetails.bio }</Text>
        </View>
      );
    } else {
      return (
        <Text>User Details Not Fetched</Text>
      );
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => navigation.navigate('userLanding'));
  };

  return (
    <View>
      <View style={ styles.mainContainer } >
        <View style={ styles.imageContainer } >
          <Image 
            defaultSource={ require('../../assets/default.png') }
            source={ picUrl } 
            resizeMode='contain'
            style={ styles.image }
          />
        </View>
        { renderUserInfo() }
      </View>
      <TouchableOpacity onPress={ handleLogout } >
        <Text style={ {textAlign: 'right'} }>
          { (user) ? 'Log Out' : 'Go Back' }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'space-evenly',
    backgroundColor: 'lightgrey',
    borderRadius: '5%',
    marginVertical: '20%',
    marginHorizontal: '5%',
  },

  imageContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: 'red',
    // borderWidth: 5,
  },

  image: {
    aspectRatio: '1/1',
    width: '75%',
    borderColor: 'grey',
    borderWidth: 5,
    borderRadius: '100%',
  },

  userDetailsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    // borderColor: 'blue',
    // borderWidth: 5,
  },

  name: {
    fontSize: 30,
    marginBottom: 30,
  },

  bio: {
    fontSize: 20,
    width: '80%',
    textAlign: 'center',
  },
});