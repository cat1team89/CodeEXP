import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db } from "../../database/firestore";
import {
    collection,
    setDoc,
    addDoc,
    getDoc,
    doc,
} from 'firebase/firestore';
import { SafeAreaView, TextInput } from 'react-native-web';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useFocusEffect, useCallback } from '@react-navigation/native';
import { encode } from 'base-64';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { Asset } from 'expo-asset';
import { Picker } from '@react-native-picker/picker';
import { icons } from '../../misc/icons';



export default function CreateEventScreen(props) {
    /* State variables for user inputs EXCEPT the dropdown list */
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);

    /* State variables used internally by dropdown list */
    const [activityType, setActivityType] = useState("nightOut");
    const [activityTypeIcon, setActivityTypeIcon] = useState(icons["nightOut"].icon);
    useEffect(() => setActivityTypeIcon(icons[activityType].icon), [activityType]);

    /* Other state variables */
    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const getByIdAndSetState = async (id, path, setter) => {
        const docSnap = await getDoc(doc(db, path, id));
        if (docSnap.exists()) {
            setter(docSnap.data());
        }
    };

    useEffect(() => {
        const listener = onAuthStateChanged(auth, async (user) => {
            setIsAuthenticated(!!user);
        });
        return () => listener();
    }, []);

    useEffect(async () => {
        const user = auth.currentUser;
        if (user) {
            const userCollectionRef = collection(db, 'user');
            const userDoc = await getDoc(doc(userCollectionRef, user.email));
            console.log(userDoc);
            setUserId(userDoc.id);
            setErrorMessage(userDoc.id);
        } else {
            setErrorMessage("ERROR: No current user detected!");
        }
    }, [isAuthenticated]);

    const submitHandler = async () => {
        setErrorMessage("");
        await addDoc(collection(db, "event"), {
            creator_id: userId,
            datetime: new Date().toLocaleString(),
            title: title,
            location: location,
            description: description,
            activity_type: activityType,
            join_list: {},
        });
    };



    return (
        <SafeAreaView style={styles.bg}>

            <View style={styles.entry}>
                <Text>Title:</Text>
                <TextInput style={styles.inputField}
                    onChangeText={setTitle}
                />
            </View>

            <View style={styles.entry}>
            <Text>Location:</Text>
            <TextInput style={styles.inputField}
                onChangeText={setLocation}
            />
            </View>

            <View style={styles.entry}>
            <Text>Description:</Text>
            <TextInput style={styles.inputField}
                onChangeText={setDescription}
            />
            </View>

            <View>
                <Text>What kind of event is it?</Text>
                <View style={styles.entry}>
                    {activityTypeIcon}
                    <Picker
                        selectedValue={activityType}
                        onValueChange={(itemValue, itemIndex) => setActivityType(itemValue)}
                    >
                        {Object.entries(icons).map(([keyString, val]) => <Picker.Item label={val.text} value={keyString} key={keyString}/>)}
                    </Picker>
                </View>
            </View>

            <Button title="Create Event" onPress={submitHandler} />

            <Text>{errorMessage}</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bg: {
        //backgroundColor:"#5a792c",
        flexDirection: "column",
        alignItems: "center",
    },
    entry: {
        backgroundColor:"#d9d9d9",
        flexDirection:"row",
        alignItems: "center",
        marginVertical: 20,
    },
    inputField: {
        backgroundColor:"#ffffff",
    }
});