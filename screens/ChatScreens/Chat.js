import React, { useState, useCallback, useEffect } from 'react'
import { Bubble, GiftedChat} from 'react-native-gifted-chat'
import {
  collection,
  getDoc, 
  doc,
  getFirestore,
  updateDoc,

} from 'firebase/firestore';
import {db, auth} from "../../database/firestore";
import {onValue, getDatabase, ref, off} from 'firebase/database';

export default function Chat(userA,userB) {
    // remove once I know how to add the chat file to stack to navigate
    userA = auth.currentUser;
    userB = "sam@doe.com";
    var chat_id = getChatID(userA, userB);
    //
    const [Messages,setMessages] = useState([])

    useEffect(() => {
        getMessages(userA,userB)
        .then((document) => {setMessages(renderMessages(document))})
        .catch(err => console.error(err)); 
        const database = getDatabase();
        const chatRef = ref(database, `chatrooms/${chat_id}`);

        onValue(chatRef, snapshot => {
          const data = snapshot.val();
          setMessages(renderMessages(data));
        });

        return () => {
            off(chatRef);
        };
    }, []);

    async function getMessages(userA,userB) {
        var chat_id = getChatID(userA, userB);
        const ChatRef = collection(db, 'chatrooms')
        const chatSnap = await getDoc(doc(ChatRef, chat_id));
        return chatSnap.data();
    }

    function getChatID(userA, userB){
        var chat_id = "";
        userA = String(userA.email);
        userA = userA.replace('.', '');
        userB = userB.replace('.','');
        if(userA.localeCompare(userB) > 0){
            chat_id = userB+"-"+userA;
        }
        else{
            chat_id = userA+"-"+userB;
        }
        return chat_id;
    }

    function toDateTime(secs) {
        var t = new Date(1970, 0, 1); 
        t.setSeconds(secs + 8*60*60);
        return t;
    }

    function renderMessages(data){
        userA = auth.currentUser;
        var Msg_array = [];
        var messages = data.Messages;
        var user_info = data.participant_details;
        var dict = {};
        var user = {};
        var count = 1;
        messages.forEach((msg) =>{
            dict = {};
            // _id: 1,
            // text: 'Hello developer',
            // createdAt: new Date(),
            // user: {
            //   _id: 2,
            //   name: 'React Native',
            //   avatar: 'https://placeimg.com/140/140/any',
            // }
            user = {}
            if(msg.sender == user_info[0].name){
                if(msg.sender == userA.email){
                    user = {
                        _id:1,
                        name:user_info[0].name,
                        avatar:'https://placeimg.com/140/140/any',
                    }
                }
                else{
                    user = {
                        _id:2,
                        name:user_info[0].name,
                        avatar:'https://placeimg.com/140/140/any',
                    }
                }
            }
            else{
                if(msg.sender == userA.email){
                    user = {
                        _id:1,
                        name:user_info[1].name,
                        avatar:'https://placeimg.com/140/140/any',
                    }
                }
                else{
                    user = {
                        _id:2,
                        name:user_info[1].name,
                        avatar:'https://placeimg.com/140/140/any',
                    }
                }
            }
            dict = {
                _id:count,
                text:msg.message,
                createdAt:toDateTime(msg.datetime.seconds),
                user,
            }
            count = count +1 ;
            Msg_array.push(dict);
        })
        console.log(Msg_array);
        return Msg_array;
    }


    const onSend = useCallback(
        async (msg = []) => {
          chat_id = getChatID(userA,userB);
          var data = await getMessages(userA,userB);
          var dict = {
              datetime: new Date(),
              message: msg[0].text,
              sender: userA.email 
            }
          const database = getFirestore();
          const Chat = doc(database, `chatrooms/${chat_id}`);
          data.Messages.push(dict);
          console.log(data.Messages);
          updateDoc(Chat, data);
          setMessages(prevMessages => GiftedChat.append(msg,prevMessages));
        },[],
    );

        const renderBubble = (props)=>{
            return (
                <Bubble
                    {...props}
                    wrapperStyle={{
                        left: {
                            backgroundColor:'white',
                            paddingBottom:10,
                            paddingTop:10,
                            paddingLeft:10,
                            paddingRight:10,

                        },
                        right: {
                            paddingBottom:10,
                            paddingTop:10,
                            paddingLeft:10,
                            paddingRight:10,
                        },
                    }}
                />
            );
        }
    console.log(Messages);
    return (
            <GiftedChat
                wrapInSafeArea ={false}
                messages={Messages}
                inverted={false}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                  _id: 1,
                  name: userA.email,
                  avatar:'https://placeimg.com/140/140/any',
                }}
            />
    );
  }



