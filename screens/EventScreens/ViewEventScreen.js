import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { db } from "../../database/firestore";
import {
    collection,
    getDoc,
    doc
} from 'firebase/firestore';
import { icons } from '../../misc/icons';

export default function ViewEvents(props) {
    const [event, setEvent] = useState(null);
    const [eventCreator, setEventCreator] = useState(null);
    const [ picUrl, setPicUrl ] = useState('');

    const getByIdAndSetState = async (id, path, setter) => {
        const docSnap = await getDoc(doc(db, path, id));
        if (docSnap.exists()) {
            setter(docSnap.data());
        }
    };

    useEffect(() => {getByIdAndSetState(props.id, "event", setEvent);}, [props.id]);
    useEffect(() => {if (event) {getByIdAndSetState(event.creator_id, "user", setEventCreator)}}, [event]);

    useEffect(() => {
        const picPath = eventCreator.picpath;
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
    }, [eventCreator]);


    if (event == null) {
        return (
            <Text>ERROR: Event not found</Text>
        );
    } else if (eventCreator == null) {
        return (
            <Text>ERROR: User not found</Text>
        );
    } else {
        console.log(eventCreator);
        console.log(event.activity_type);
        return (
            <View>
                {icons[event.activity_type].icon}
                <Text>{event.title}</Text>
                <Text>When: {event.datetime}</Text>
                <Text>Where: {event.location}</Text>
                <Image source={ picUrl } style={{height: 200, width: 250}} />
                <Text>By: {eventCreator.uFirstname} {eventCreator.uLastname}</Text>
                <Text>Notes: {event.description}</Text>
            </View>
        );
    }
}