import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db } from "../../database/firestore";
import {
    collection,
    setDoc,
    addDoc,
    getDoc,
    doc,
} from 'firebase/firestore';
import { firestore } from 'firebase-admin';
import { SafeAreaView, TextInput } from 'react-native-web';
import { getAuth } from "firebase/auth";
import { useFocusEffect, useCallback } from '@react-navigation/native';
import { encode } from 'base-64';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Asset } from 'expo-asset';
import { Picker } from '@react-native-picker/picker';
import { icons } from '../../misc/icons';


/**
 * 
 * props should contain:
 *      currentUser -- js object representing current user, including his id
 */
export default function CreateEventScreen(props) {
    /* State variables for user inputs EXCEPT the dropdown list */
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    /* State variables used internally by dropdown list */
    const [activityType, setActivityType] = useState("orderIn");
    const [activityTypeIcon, setActivityTypeIcon] = useState(icons["orderIn"].icon);
    useEffect(() => setActivityTypeIcon(icons[activityType].icon), [activityType]);

    /* Other state variables */
    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const getByIdAndSetState = async (id, path, setter) => {
        const docSnap = await getDoc(doc(db, path, id));
        if (docSnap.exists()) {
            setter(docSnap.data());
        }
    };

    useEffect(async () => {
        const user = auth.currentUser;
        if (user) {
            const userCollectionRef = collection(db, 'user');
            const userDoc = await getDoc(doc(userCollectionRef, user.email));
            console.log(userDoc);
            setUserId(userDoc.id);
        } else {
            setErrorMessage("ERROR: No current user detected!");
        }
    }, []);

    const submitHandler = async () => {
        setErrorMessage("");
        await addDoc(collection(db, "event"), {
            creator_id: userId,
            datetime: new Date().toLocaleString(),
            title: title,
            location: location,
            description: description,
            activity_type: activityType,
        });
    };

    return (
        <SafeAreaView>
            <Text>Title:</Text>
            <TextInput
                onChangeText={setTitle}
            />
            {activityTypeIcon}
            <Text>Location:</Text>
            <TextInput
                onChangeText={setLocation}
            />
            <Text>Description:</Text>
            <TextInput
                onChangeText={setDescription}
            />
            <Picker
                selectedValue={icons[activityType].text}
                onValueChange={(itemValue, itemIndex) => setActivityType(itemValue)}
            >
                {Object.entries(icons).map(([key, val]) => <Picker.Item label={val.text} value={key} />)}
            </Picker>
            <Button title="Create Event" onPress={submitHandler} />
            <Text>{errorMessage}</Text>
        </SafeAreaView>
    );
}