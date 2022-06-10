import { StyleSheet, Text, View, Button } from 'react-native';


export default function UserLandingScreen({ navigation }) {
  return (
    <View>
      <Text>User Lands Here</Text>
      <Button onPress={() => navigation.navigate('userLogin')} title='Log In' />
      <Button onPress={() => navigation.navigate('userReg')} title='Register' />
    </View>
  );
}