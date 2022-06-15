import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
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
import { FlatList, SafeAreaView, ScrollView } from 'react-native-web';
import { Button } from 'react-native-elements';
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
            <SafeAreaView style={styles.container}>
                <View style={{flexDirection:"row", height:200}}>
                    <View style={{flexDirection:"column", flex: 0.4 }}>
                        <Image source={ picUrl } style={{height: 75, width: 93.75}} />
                        {
                            (!(event.creator_id.normalize() === userEmail.normalize())) ? 
                            <Button titleStyle={{color: "white",fontSize: 10}} title={userIsJoining ? "Can't make it" : "I'm in!"} onPress={handleJoinEventButtonPress}/> :
                            <Text>You created this event.</Text>
                        }
                        <Button titleStyle={{color: "white",fontSize: 10}} title="Refresh Participants" onPress={() => getByIdAndSetState(props.id, "event", setEvent)} />
                    </View>

                    <View style={{flexDirection:"column",flex:1}}>

                        <View style={{flexDirection:"row", flex: 1}}>
                            {icons[event.activity_type].icon}
                            <Text>{event.title}</Text>
                        </View>

                        <View style={{flexDirection:"column", flex: 10}}>

                            <View style={{display:"grid", gridTemplateColumns:'50px auto', flex: 0.3}}>
                                <Text>By:</Text><Text>{eventCreator.uFirstname} {eventCreator.uLastname}</Text>
                                <Text>When:</Text><Text>{event.datetime}</Text>
                                <Text>Where:</Text><Text>{event.location}</Text>
                                <Text>{event.description ? "Notes:" : ""}</Text><Text>{event.description}</Text>
                            </View>

                            <View style={{flex: 0.1}}>
                                <Text >{errorMessage}</Text>
                            </View>

                            <View style={{flex: 0.1}}>
                                <Text style={{textAlign:"center"}}>{Object.keys(participants).length} Participant{Object.keys(participants).length === 1 ? "" : "s"}</Text>
                            </View>

                            <ScrollView contentContainerStyle={{flexGrow:1}} style={{flex:0.5}}>
                                <FlatList style={{backgroundColor:"#FFE4C4"}}
                                    data={participants}
                                    renderItem={
                                        ({item}) => {
                                            return (
                                                <View style={{flexDirection:"row"}}>
                                                    <Text>{item.uFirstname} {item.uLastname}</Text>
                                                </View>
                                            );
                                        }
                                    }
                                />
                            </ScrollView>
                        </View>

                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    horizontal: {
    
    },
    vertical: {

    },
    container: {
        backgroundColor: 'lightgray',
        alignItems: 'left',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical:20,
        margin: 10,
    },
});