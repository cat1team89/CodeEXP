import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from "../database/firestore";

export default function DBTestProfiles() {

  let [ events, setEvents] = useState([]);
  
  async function getEvent(db) {
    let res = [];
    const querySnapshot = await getDocs(collection(db, "user"));
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
        res.map((user) => {
          if (user.data && user.data.uFirstName) {
            user.data.uFirstName = user.data.uFirstName.toString();
          }
        })
        setEvents(res);
      })
      .catch(err => console.error(err));
  }, []);

    
  return (
    <View>
      <View>{events.map((user) => (
          <View key={ user.id }>
            <Text>ID: { user.id }</Text>
            <Text>Name: { user.data.uFirstname } { user.data.uLastname }</Text>
            <Text>Camp: { user.data.uCamp }</Text>
            <Text>Bio: { user.data.uBio }</Text>
          </View>
        ))}
      </View>
    </View>
  );
}