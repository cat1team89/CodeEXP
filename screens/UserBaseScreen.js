import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { db, auth } from "../database/firestore";
import UserLandingScreen from './UserStack/UserLandingScreen';
import UserLoginScreen from './UserStack/UserLoginScreen';
import UserRegistrationScreen from './UserStack/UserRegistrationScreen';
import UserAuthedScreen from './UserStack/UserAuthedScreen';
import HelplineScreen from './UserStack/HelplineScreen';
import Chat from './ChatScreens/Chat';
import Chats from './ChatScreens/Chats';
import AddChat from './ChatScreens/AddChat';

const Stack = createStackNavigator();

export default function UserBaseScreen() {
  
  const handleInitialRoute = () => {
    const user = auth.currentUser;
    if (user) {
      return 'userAuthed';
    } else {
      return 'Sign In';
    }
  }

  return (
    <Stack.Navigator
      initialRouteName={ handleInitialRoute() }
    >
      <Stack.Screen 
        name="userLanding" 
        component={ UserLandingScreen }
        options={{
          headerShown: false,
        }} 
      />
      <Stack.Screen name="Sign In" component={ UserLoginScreen } />
      <Stack.Screen name="Register" component={ UserRegistrationScreen } />
      <Stack.Screen 
        name="userAuthed" 
        component={ UserAuthedScreen }
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="Chat" component={ Chat} />
      <Stack.Screen name="Chats" component={ Chats } />
      <Stack.Screen name="AddChat" component={ AddChat} />
      <Stack.Screen name="Help Lines" component={ HelplineScreen } />
    </Stack.Navigator>
  );
}