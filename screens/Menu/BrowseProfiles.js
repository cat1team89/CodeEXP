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

import { SearchBar } from 'react-native-elements';
import { Icon } from 'react-native-elements'

export default class App extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
        
      />
    );
  }
}

