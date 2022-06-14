import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, ScrollView } from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from "../database/firestore";
import BoxContainer from './BoxContainer';
import ViewEventScreen from './EventScreens/ViewEventScreen';
import { FlatList } from 'react-native-web';

export default function DBTestEvents() {

    let [ events, setEvents] = useState([]);
    
    async function getEvent(db) {
        let res = [];
        const querySnapshot = await getDocs(collection(db, "event"));
        querySnapshot.forEach((doc) => {
            res.push({
                id: doc.id,
                data: doc.data(),
            });
            console.log(`${doc.id} => ${doc.data()}`);
        });
        
        return res;
    };

    
    useEffect(() => {
        getEvent(db)
            .then(res => {
                setEvents(res);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <FlatList
            data={events}
            renderItem={({item}) => {
                return <ViewEventScreen id={item.id}/>;
            }}
        />
        // <ScrollView>
        //     {
        //       events.map((event) => (<ViewEventScreen id={event.id}/>))
        //     }
        // </ScrollView>
    );
  
}

