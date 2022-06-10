import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  Button, 
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DBTestScreen from './screens/DBTestScreen';
import UserBaseScreen from './screens/UserBaseScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    //   <DBTestScreen></DBTestScreen>
    // </View>
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Test" component={ DBTestScreen } />
        <Tab.Screen name="user" component={ UserBaseScreen } />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
