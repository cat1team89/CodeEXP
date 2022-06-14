import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import {
  collection,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import { db, auth } from "../database/firestore";
import AddChat from './ChatScreens/AddChat';
import { ScrollView } from 'react-native-web';

export default function DBTestProfiles({navigation}) {

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
          <View key={ user.id } style = {styles.container}>
            <Text>ID: { user.id }</Text>
            <Text>Name: { user.data.uFirstname } { user.data.uLastname }</Text>
            <Text>Camp: { user.data.uCamp }</Text>
            <Text>Bio: { user.data.uBio }</Text>
           <View> 
            <Button 
              title = "Chat"
              onPress={() => {
                AddChat(auth.currentUser, user.id, navigation)
                // navigation.navigate('Chat', {userB:user.id})
              }}
            />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray',
    alignItems: 'left',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical:20,
    margin: 10,
  },
});