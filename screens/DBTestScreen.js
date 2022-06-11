import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db } from "../database/firestore";


export default function DBTestScreen() {

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
  
  async function addEvent(db) {
    try {
      const docRef = await addDoc(collection(db, "event"), {
        edatetime: new Date("2022-07-01T20:00:00"),
        ename: 'Basketball',
        edesc: 'Causal game. Beginners welcomed.',
        epax: 5,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  
  useEffect(() => {
    // addEvent(db);
    getEvent(db)
      .then(res => {
        res.map((event) => {
          if (event.data && event.data.edatetime) {
            event.data.edatetime = event.data.edatetime.toString();
          }
        })
        setEvents(res);
      })
      .catch(err => console.error(err));
  }, []);

    
  return (
    <View>
      <Text>Total num of events: { events.length }</Text>
      <View>{events.map((event) => (
          <View key={ event.id }>
            <Text>ID: { event.id }</Text>
            <Text>Name: { event.data.ename }</Text>
            <Text>Desc: { event.data.edesc }</Text>
            <Text>Date: { event.data.edatetime }</Text>
            <Text>Pax: { event.data.epax }</Text>
          </View>
        ))}
      </View>
    </View>
  );
}