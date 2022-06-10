import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from "../database/firestore";
import UserLandingScreen from './UserStack/UserLandingScreen';
import UserLoginScreen from './UserStack/UserLoginScreen';
import UserRegistrationScreen from './UserStack/UserRegistrationScreen';

const Stack = createStackNavigator();

export default function UserBaseScreen() {

  let [ events, setEvents] = useState([]);
  
  useEffect(() => {
    
  }, []);

    
  return (
    <Stack.Navigator>
      <Stack.Screen name="userLanding" component={ UserLandingScreen } />
      <Stack.Screen name="userLogin" component={ UserLoginScreen } />
      <Stack.Screen name="userReg" component={ UserRegistrationScreen } />
    </Stack.Navigator>
  );
}