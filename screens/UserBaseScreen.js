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
import UserAuthedScreen from './UserStack/UserAuthedScreen';

const Stack = createStackNavigator();

export default function UserBaseScreen() {
    
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="userLanding" 
        component={ UserLandingScreen }
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen name="Login" component={ UserLoginScreen } />
      <Stack.Screen name="Register" component={ UserRegistrationScreen } />
      <Stack.Screen 
        name="userAuthed" 
        component={ UserAuthedScreen }
        option={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}