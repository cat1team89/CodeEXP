import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db, auth } from "../database/firestore";

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
            <Button title = "Chat" onPress={() => navigation.navigate('AddChat', { userA: auth.currentUser,userB:user.id})} />
          </View>
        ))}
      </View>
    </View>
  );
}
