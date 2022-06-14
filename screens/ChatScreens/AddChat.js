import React, {useEffect } from 'react'
import {
  collection,
  getDoc, 
  doc,
  setDoc,

} from 'firebase/firestore';
import {db} from "../../database/firestore";

export default function AddChat(userA,userB) {
    var chat_id = getChatID(userA,userB);
    useEffect(() => {
        AddChat(userA,userB)
        .then()
        .catch(err => console.error(err)); 
    },[]);

    async function AddChat(userA,userB){
        const chatRef = collection(db, 'chatrooms');
        const chatSnap = await getDoc(doc(chatRef, chat_id));
        console.log(chat_id);
        console.log(chatSnap.exists());
        if(chatSnap.exists()){
            console.log("exists");
            return;
        }
        const userRef = collection(db, 'user')
        const userASnap = await getDoc(doc(userRef,userA.email));
        console.log(userA.email);
        console.log(userASnap.data().uPicPath);

        const userAPicPath = userASnap.data().uPicPath;
        const userBSnap = await getDoc(doc(userRef,userB));
        const userBPicPath = userBSnap.data().uPicPath;

        console.log(userAPicPath,userBPicPath);
        var data= {
            participants:[userA.email,userB],
            participant_details:[
                {
                    name: userA.email,
                    uPicPath: userAPicPath,
                },
                {
                    name:userB,
                    uPicPath: userBPicPath,
                }
            ],
            Messages:[]
        }
        console.log(chat_id);
        await setDoc(doc(db, "chatrooms", chat_id), data);

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

    return (navigation.navigate('Chat', { userA:userA, userB:userB}));

}