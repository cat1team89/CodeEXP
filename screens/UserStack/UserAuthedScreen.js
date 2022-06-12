import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { ref, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from "../../database/firestore";

function LoadUserProfile({ navigation }) {
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
    </View>
  );
};


const Drawer = createDrawerNavigator();

export default function UserAuthedScreen({ navigation }) {
  function OptionsMenu(props) {
    const handleLogout = () => {
      signOut(auth).then(() => {
        const parent = navigation.getParent();
        parent.navigate('userLanding');
      });
    };
  
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem label="Log Out" onPress={ handleLogout } />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      useLegacyImplementation={ true }
      drawerContent={ (props) => (<OptionsMenu {...props} />) }
      screenOptions={{
        drawerPosition:'right',
      }}
    >
      <Drawer.Screen 
        name="Profile" 
        component={ LoadUserProfile }
        options={{
          headerLeft: false,
          headerRight: () => (
            <TouchableOpacity  onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Ionicons name="menu" size={30} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </Drawer.Navigator>
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