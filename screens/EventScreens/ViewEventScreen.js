import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db, storage } from "../../database/firestore";
import {
    collection,
    getDoc,
    doc,
    setDoc,
    addDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteField
} from 'firebase/firestore';
import { icons } from '../../misc/icons';
import { Button, FlatList } from 'react-native-web';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, getDownloadURL } from 'firebase/storage';

export default function ViewEventScreen(props) {
    const convertEmail = (emailString) => emailString.replaceAll(".", "%24");

    const [event, setEvent] = useState(null);
    const [eventCreator, setEventCreator] = useState(null);
    const [picUrl, setPicUrl] = useState('');
    const [userIsJoining, setUserIsJoining] = useState(false);

    const [participants, setParticipants] = useState({});

    const [userEmail, setUserEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        setErrorMessage("");
        const user = auth.currentUser;
        if (user) {
            setUserEmail(user.email);
        } else {
            setErrorMessage("ERROR: No current user detected!");
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const listener = onAuthStateChanged(auth, async (user) => {
            setIsAuthenticated(!!user);
        });
        return () => listener();
    }, []);

    const getByIdAndSetState = async (id, path, setter) => {
        const docSnap = await getDoc(doc(db, path, id));
        if (docSnap.exists()) {
            setter(docSnap.data());
        } else {
            setErrorMessage("ERROR");
        }
    };

    useEffect(() => {getByIdAndSetState(props.id, "event", setEvent);}, [props.id]);
    useEffect(() => {if (event) {getByIdAndSetState(event.creator_id, "user", setEventCreator)}}, [event]);
    useEffect(() => {if (event) {
        const user = auth.currentUser;
        if (event.join_list.hasOwnProperty(convertEmail(user.email))) {
            setUserIsJoining(true);
        } else {
            setUserIsJoining(false);
        }
    }}, [event]);

    useEffect(() => {
        if (eventCreator) {
            const picPath = eventCreator.uPicPath;
            if (picPath) {
                const picRef = ref(storage, picPath);
                getDownloadURL(picRef)
                    .then((url) => {
                    console.log(url);
                    setPicUrl(url);
                    })
                    .catch((err) => {
                    console.error(err);
                    });
            }
        }
    }, [eventCreator]);

    useEffect(async () => {
        console.log("hi from trying to set participants now");
        if (event) {
            const emailArr = [];
            console.log(Object.keys(event.join_list));
            for (let i=0; i<Object.keys(event.join_list).length; i++) {
                const email = Object.keys(event.join_list)[i];
                const restoredEmail = email.replaceAll("%24", ".");
                console.log(email)
                console.log(restoredEmail);
                console.log(participants);
                await getByIdAndSetState(restoredEmail, "user", (data) => emailArr.push(data));
            }
            setParticipants(emailArr);
        }
    }, [event, userIsJoining]);

    const handleJoinEventButtonPress = async () => {
        const user = auth.currentUser;
        const convertedEmail = convertEmail(user.email);
        const prevJointList = event.join_list;
        await updateDoc(doc(db, "event", props.id), {
            [`join_list.${convertedEmail}`]: (userIsJoining? deleteField() : true),
        });
        setUserIsJoining(!userIsJoining);
    };


    if (event == null) {
        return (
            <Text>ERROR: Event not found</Text>
        );
    } else if (eventCreator == null) {
        return (
            <Text>ERROR: User not found</Text>
        );
    } else {
        // console.log(eventCreator);
        // console.log(event.activity_type);
        return (
            //<Text>{props.id}, {event.title} by {eventCreator.uFirstname} {eventCreator.uLastname}</Text>
            <View>
                {icons[event.activity_type].icon}
                <Text>{event.title}</Text>
                <Text>When: {event.datetime}</Text>
                <Text>Where: {event.location}</Text>
                <Image source={ picUrl } style={{height: 200, width: 250}} />
                <Text>By: {eventCreator.uFirstname} {eventCreator.uLastname}</Text>
                <Text>Notes: {event.description}</Text>
                {
                    (!(event.creator_id.normalize() === userEmail.normalize())) ? 
                    <Button title={userIsJoining ? "Can't make it" : "I'm in!"} onPress={handleJoinEventButtonPress}/> :
                    <Text>You created this event.</Text>
                }
                <Text>{errorMessage}</Text>
                <FlatList
                    data={participants}
                    renderItem={({item}) => <Text>{item.uFirstname} {item.uLastname}</Text>}
                />
                <Button title="Refresh Participants" onPress={() => getByIdAndSetState(props.id, "event", setEvent)} />
            </View>
        );
    }
}