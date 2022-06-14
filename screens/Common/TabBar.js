import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import CreateEventScreen from '../EventScreens/CreateEventScreen';
import UserBaseScreen from '../UserBaseScreen';
import ViewEventScreen from '../EventScreens/ViewEventScreen';
import BrowseEvents from '../BrowseEvents';
import BrowseProfiles from '../BrowseProfiles';
import Chat from '../ChatScreens/Chat';
import Chats from '../ChatScreens/Chats';


/**
 * Sort of done by shengbin already haha but idk i might as well extract it out here in case we want it
 */

const tabBar = createBottomTabNavigator();

export default function TabBar(props) {
    return (
        <tabBar.Navigator>
            <tabBar.Screen
                name="Profiles"
                component={BrowseProfiles}
            />
            <tabBar.Screen 
                name="Events"
                component={BrowseEvents}
            />
            <tabBar.Screen
                name="+"
                component={ CreateEventScreen }
            />
            <tabBar.Screen
                name="Chats"
                component={ ChatStack }
                options={{
                    headerShown: false,
                }}
            />
            <tabBar.Screen
                name="My Profile"
                component={ UserBaseScreen }
                options={{
                    headerShown: false,
                }}
            />
        </tabBar.Navigator>
    );
}

const Stack = createStackNavigator();

const ChatStack = (prop) => {
    // console.log(navigation)
    console.log(prop)
    let userB;
    let toGo;
    if (prop.route.params) {
        userB = prop.route.params.userB;
        toGo = prop.route.params.goToChat;
    }

    useEffect(()=>{
        if (prop.route.params) {
            console.log(toGo);
            console.log(userB)
        }

        if (toGo) {
            prop.navigation.navigate('Chat', {userB:userB})
        }
    }, []);

    // const handleInitialRoute = () => {
    //     if (toGo) {
    //         return 
    //     }
    // }

    return (
        <Stack.Navigator>


            <Stack.Screen name="ChatsList" component={ Chats } />
            <Stack.Screen name="Chat" component={ Chat } />

        </Stack.Navigator>
    );
}