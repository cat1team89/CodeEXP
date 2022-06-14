import React, { useState, useEffect } from 'react';
import { View,Button, StyleSheet,Text} from 'react-native';
import {
  collection,
  getDocs,
  query, 
  where,
} from 'firebase/firestore';
import {db, auth} from "../../database/firestore";


export default function Chats({navigation}) {
    let [ ChatDocs, setChatDocs ] = useState([]);
    const user = auth.currentUser;
    useEffect(() => {
        getChats(user)
        .then((ChatDocs) => {setChatDocs(ChatDocs)})
        .catch(err => console.error(err));
      }, [])
    async function getChats(user) {
        const q = query(collection(db, "chatrooms"),where("participants", "array-contains", user.email));
        const chatSnapshot = await getDocs(q);
        return chatSnapshot;
    }

    function getChatDetails(doc){
        let time = String(0);
        let last_msg = String(null);
        let name = String(null);
        let sender = String(null);
        console.log(doc.data());
        doc.data().Messages.forEach((msg) => {
            if(msg["datetime"]["seconds"] >= time){
                time = msg["datetime"]["seconds"];
                last_msg = msg["message"];
                if(msg["sender"] == user.email){
                    sender = "me";
                }
                else{
                    sender = msg["sender"];
                }
            }
        });
        console.log(sender, last_msg);
        doc.data().participants.forEach((participant) =>{
            if(participant != user.email){
                name = participant;
            }
        });
        var dict = {
            name: String(name),
            last_msg: String(last_msg),
            time: toDateTime(time),
            sender: String(sender)
        };
        return dict;
    }

    function toDateTime(secs) {
        var t = new Date(1970, 0, 1); 
        secs = secs + 8*60*60
        t.setSeconds(secs);
        var str_t = t.toString();
        return str_t.slice(4,24);
    }

    if(ChatDocs){
        var chats = []
        ChatDocs.forEach((doc) =>{
            console.log(doc.data());
            var dict = getChatDetails(doc);
            console.log(dict);
            chats.push(dict);
        })

        return (
            <View style = {styles.scroll}>
            {chats.map((chat) => ( 
                <View key={ chat.name } style = {styles.container}>
                {/* // eslint-disable-next-line react/jsx-key */}
                <div className='contact-details'>
                    <Text>{chat.name}</Text>
                    <Text>{chat.sender}: {chat.last_msg}</Text>
                    <Text>{(chat.time)}</Text>
                    <Button title = "Chat"
                    onPress={() => {
                        // console.log(chat);
                        // console.log(chat.name);

                        navigation.navigate('Chat', { userB:chat.name})
                    }
                    } />
                </div>
                </View>
            ))}
            </View>
            
        );
    }

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
    scroll:{ 
        overflow:scroll,
    },
  });