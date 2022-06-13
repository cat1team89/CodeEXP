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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
  collection,
  doc,
  getDoc,
} from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { ref, getDownloadURL } from 'firebase/storage';
import {
  useFonts,
  SairaStencilOne_400Regular,
} from '@expo-google-fonts/saira-stencil-one';
import { auth, db, storage } from "../../database/firestore";


function LoadUserProfile({ navigation }) {
  let [ fontsLoaded ] = useFonts({ SairaStencilOne_400Regular });

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
    };
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
      camp: data.uCamp,
      picpath: data.uPicPath ? data.uPicPath : null,
    };
  };

  const renderUserInfo = () => {
    if (userDetails.email) {
      return (
        <View style={ styles.userDetailsContainer } >
          <Text style={ styles.name } >{ userDetails.fname } { userDetails.lname }</Text>
          
          <View style={ styles.camp } >
            <MaterialIcons name="home-work" size={24} color="black" />
            <Text
              style={ fontsLoaded ? { fontFamily: 'SairaStencilOne_400Regular', fontSize : 17 } : {fontSize : 17}}
            >
              {' '}{ userDetails.camp }
            </Text>
          </View>

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
    const handleNavHelplines = () => {
      // const parent = navigation.getParent();
      // parent.navigate('Help Lines');
      navigation.navigate('Help Lines');
    };

    const handleLogout = () => {
      signOut(auth).then(() => {
        // const parent = navigation.getParent();
        // parent.navigate('Sign In');
        navigation.navigate('Sign In');

      });
    };
  
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem 
          label="Help Lines" 
          onPress={ handleNavHelplines } 
        />
        <DrawerItem
          label="Log Out"
          onPress={ handleLogout }
        />
      </DrawerContentScrollView>
    );
  };

  return (
    <Drawer.Navigator
      // initialRouteName='My Profile'
      useLegacyImplementation={ true }
      drawerContent={ (props) => (<OptionsMenu {...props} />) }
      screenOptions={{
        drawerPosition:'right',
      }}
    >
      <Drawer.Screen 
        name="My Profile" 
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
    backgroundColor: '#d9d9d9',
    borderRadius: '5%',
    borderColor: '#5a792c',
    borderWidth: 3,
    marginVertical: '15%',
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
    width: '80%',
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

  camp: {
    flexDirection: 'row',
    marginBottom: 30,
  },

  name: {
    fontSize: 30,
  },

  bio: {
    fontSize: 20,
    width: '80%',
    textAlign: 'center',
  },
});