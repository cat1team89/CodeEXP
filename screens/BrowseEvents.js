import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from "../database/firestore";
import BoxContainer from './BoxContainer';

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
        <View>{events.map((event) => (
            <View key={ event.id }>
                <Text>Creator: { event.data.creator_id }</Text>
                <Text>Activity: { event.data.activity_type }</Text>
                <Text>Date/Time: { event.data.datetime }</Text>
                <Text>Location: { event.data.location }</Text>
                <Text>Description: { event.data.description }</Text>
            </View>
        ))}
      </View>
  );
  
}

