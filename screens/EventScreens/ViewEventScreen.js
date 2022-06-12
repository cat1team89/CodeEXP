import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { db } from "../../database/firestore";
import {
    collection,
    getDoc,
    doc
} from 'firebase/firestore';
import { firestore } from 'firebase-admin';

/**
 * 
 * props should contain:
 *      id -> id of event being viewed
 *  
 */

export default function ViewEvents(props) {
    const [event, setEvent] = useState(null);
    const [eventCreator, setEventCreator] = useState(null);

    const getByIdAndSetState = async (id, path, setter) => {
        const docSnap = await getDoc(doc(db, path, id));
        if (docSnap.exists()) {
            setter(docSnap.data());
        }
    };

    useEffect(() => {getByIdAndSetState(props.id, "event", setEvent);}, [props.id]);
    useEffect(() => {if (event) {getByIdAndSetState(event.creator_id, "user", setEventCreator)}}, [event]);


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
        return (
            <View>
                <Image source={{uri: event.image}} style={{height: 200, width: 250}}/>
                <Text>{event.title}</Text>
                <Text>When: {event.datetime}</Text>
                <Text>Where: {event.location}</Text>
                <Image source={{uri: eventCreator.image}} style={{height: 200, width: 250}} />
                <Text>By: {eventCreator.name}</Text>
                <Text>Notes: {event.description}</Text>
            </View>
        );
    }
}