import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreateEventScreen from '../EventScreens/CreateEventScreen';
import UserBaseScreen from '../UserBaseScreen';
import BrowseEvents from '../Menu/BrowseEvents';
import BrowseProfiles from '../Menu/BrowseProfiles';


/**
 * Sort of done by shengbin already haha but idk i might as well extract it out here in case we want it
 */

const tabBar = createBottomTabNavigator();

export default function TabBar(props) {
    return (
        <tabBar.Navigator>
            <tabBar.Screen
                name="Profiles"
                component={() => <BrowseProfiles/>} // TODO: paste in profile menu component JSX
            />
            <tabBar.Screen 
                name="Events"
                component={() => <BrowseEvents/>} // TODO: paste in events menu component JSX
            />
            <tabBar.Screen
                name="+"
                component={ CreateEventScreen }
            />
            <tabBar.Screen
                name="Chats"
                component={() => <Text>Under Construction</Text>} // TODO: paste in past chats list component JSX
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