import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { db } from "../../database/firestore";
import {
    collection,
    setDoc,
    addDoc,
    doc,
} from 'firebase/firestore';
import { firestore } from 'firebase-admin';
import { SafeAreaView, TextInput } from 'react-native-web';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from "firebase/auth";
import { useFocusEffect, useCallback } from '@react-navigation/native';


export default function CreateEventScreen(props) {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    const [errorMessage, setErrorMessage] = useState("");

    const pickImage = async() => {
        const res = await ImagePicker.launchImageLibraryAsync();
        if (!res.cancelled) setImage(res);
    };

    const takePicture = async() => {
        const res = await ImagePicker.launchCameraAsync();
        if (!res.cancelled) setImage(res);
    };

    const submitHandler = async () => {
        setErrorMessage("");
        if (props.currentUser === undefined) {
            setErrorMessage("ERROR: No current user detected!");
            return;
        }

        await addDoc(collection(db, "event"), {
            creator_id: props.currentUser.id,
            datetime: new Date().toLocaleString(),
            title: title,
            location: location,
            description: description,
            image: image.uri,
        });
    };

    return (
        <SafeAreaView>
            <Text>Title:</Text>
            <TextInput
                onChangeText={setTitle}
            />
            <Text>Location:</Text>
            <TextInput
                onChangeText={setLocation}
            />
            <Text>Description:</Text>
            <TextInput
                onChangeText={setDescription}
            />
            <Button title="Pick Image" onPress={pickImage} />
            <Button title="Take Picture" onPress={takePicture} />
            {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }}/>}
            <Button title="Create Event" onPress={submitHandler} />
            <Text>{errorMessage}</Text>
        </SafeAreaView>
    );
}