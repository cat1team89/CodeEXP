import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View,
    TextInput,
    TouchableOpacity,
    Image,
} from 'react-native';
import {
    doc,
    setDoc,
} from 'firebase/firestore';
import { ref, uploadString } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from "../database/firestore";


export default function EditProfileScreenTest({ navigation }) {
    let [ fname, setFname ] = useState('');
    let [ lname, setLname ] = useState('');
    let [ bio, setBio ] = useState('');
    let [ photoStr, setPhotoStr ] = useState(null);
    let [ photoUri, setPhotoUri ] = useState('');

    const user = auth.currentUser;

    const renderImagePreview = () => {
        if (photoUri) {
        return (
            <Image 
                defaultSource={ photoUri }
                source={ photoUri } 
                resizeMode='contain'
                style={ styles.imagePreview }
            />
        )
        } else {
        return null;
        }
    };

    const handleUpdate = () => {
        updateDB(user.email)
        .catch((err) => {
            console.log('Failed to update profile');
            console.error(err);
        });
        if (photoStr) {
            addUserPhoto(user.email);
        }
    };

    const handlePickImage = () => {
        let options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        };
        ImagePicker.launchImageLibraryAsync(options)
        .then((result) => {
            console.log('result = ', result);
            if (result.cancelled === true) {
            console.log('User cancelled image picker');
            } else {
            setPhotoStr(result.base64);
            setPhotoUri(result.uri);
            }
        })
        .catch((err) => {
            console.error(err);
        });
    };

    async function updateDB(email) {
        try {
        const ref = await setDoc(doc(db, "user", email), {
            uFirstname: fname,
            uLastname: lname,
            uBio: bio,
            uCamp: camp,
            uPicPath: `profilepics/${email}`,
        });
        console.log("Profile updated: ", email);
        } catch (err) {
        console.error("Error updating profile: ", err);
        }
    };

    async function addUserPhoto(email) {
        const storageRef = ref(storage, `profilepics/${email}`);
        uploadString(storageRef, photoStr, 'base64')
        .then((snapshot) => {
            console.log(`Uploaded base64 str for : ${email}`);
        });
    };

    return (
    <View>
        <Text style={styles.title} >Update Profile</Text>

        <Text>First Name</Text>
        <TextInput
        style = { styles.input }
        label='First name here'
        autoCapitalize='words'
        onChangeText={ newText => setFname(newText.trim()) }
        />

        <Text>Last Name</Text>
        <TextInput
        style = { styles.input }
        label='Last name here'
        autoCapitalize='words'
        onChangeText={ newText => setLname(newText.trim()) }
        />

        <Text>Bio </Text>
        <TextInput
        style = { styles.input }
        label='Bio here'
        onChangeText={ newText => setBio(newText.trim()) }
        />

        <TouchableOpacity 
        onPress={ handlePickImage } 
        style={{ width: '40%', alignSelf: 'center' }}
        >
        <Text style={{
            textAlign: 'center', 
            borderWidth: 3,
            borderColor: 'grey',
        }}>Choose from gallery</Text>
        </TouchableOpacity>
        { renderImagePreview() }

        <TouchableOpacity 
        style={ styles.button }
        onPress={() => {{handleUpdate()}; alert("Profile Updated")} }
        >
        <Text style={ styles.buttonText }>Save</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom : 30,
        paddingTop: 10,
      },

    input: {
        borderColor: "gray",
        width: "100%",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },

    button: {
        elevation: 8,
        backgroundColor: "#456789",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        marginVertical: 10,
    },

    buttonText: {
        fontSize: 18,
        color: "#ffffff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase",
    },

    imagePreview: {
        alignSelf: 'center',
        aspectRatio: '1/1',
        width: '30%',
        borderColor: 'grey',
        borderWidth: 5,
        borderRadius: '100%',
    },
});