import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

/**
 * Sort of done by shengbin already haha but idk i might as well extract it out here in case we want it
 */

const tabBar = createBottomTabNavigator();

export default function TabBar(props) {
    return (
        <tabBar.Navigator>
            <tabBar.Screen
                name="Profiles"
                component={() => <Text>Under Construction</Text>} // TODO: Link to page
            />
            <tabBar.Screen 
                name="Events"
                component={() => <Text>Under Construction</Text>} // TODO: Link to page
            />
            <tabBar.Screen
                name="My Profile"
                component={() => <Text>Under Construction</Text>} // TODO: Link to page
            />
        </tabBar.Navigator>
    );
}