import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button,StyleSheet, FlatList, ActivityIndicator,Platform } from 'react-native';

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


export default class App extends React.Component {
  constructor(props)
  {super(props);

  this.state = { 
    search: '', isLoading: true
  };
  this.arrayholder = [];
}
componentDidMount(){
  return fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(responseJson => {this.setState(
    {
      isLoading: false, dataSource: responseJson,
    },
    function() {
      this.arrayholder = responseJson;
    }

  );
}).catch(error => {console.error(error);
});
}
    search = text=> {console.log(text);
};
clear = () => {this.search.clear();
};
  SearchFilterFunction(text){
    const newData = this.arrayholder.filter(function(item){
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData)
    });
    this.setState({
      dataSource: newData, search :text,
    });
  }
  ListViewItemSeperator = () => {
    return(<View
      style ={{height: 0.4, width: '89%', backgroundColor: '#141313',}}/>);

  };

  render() {
    if(this.state.isLoading){
      return (<View style = {{flex:1, paddingTop: 21}}><ActivityIndicator/></View>
      );
    }
    return(
      <View style={StyleSheet.viewStyle}>
        <SearchBar round
        searchIcon ={{size:25}}
        onChangeText={text=>this.SearchFilterFunction(text)}
        onClear={text=>this.SearchFilterFunction('')}
        placeholder="Search Events..."
        value ={this.state.search}/>
        <FlatList data={this.state.dataSource}
        ItemSeperatorComponent={this.ListViewItemSeperator}
        renderItem={({item})=>(<Text style={StyleSheet.textStyle}>{item.title}
        </Text>)}
        enableEmptySections={true}
        style={{marginTop:11}}
        keyExtractor={(item,index)=>index.toString()}/>

      </View>
    );}
        }
      const styles = StyleSheet.create({viewStyle:{
        justsifyContent:'centre',flex:1,
        backgroundColor:'#bffff4',
      },
    textStyle:{padding:11,},});

