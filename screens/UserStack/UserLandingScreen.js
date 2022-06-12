import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';


export default function UserLandingScreen({ navigation }) {
  return (
    <View>
      <Text>User Lands Here</Text>
      <TouchableOpacity 
        style={ styles.button }
        onPress={() => navigation.navigate('Login')} 
      >
        <Text style={ styles.buttonText } >Log In Here</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={ styles.button }
        onPress={() => navigation.navigate('Register')} 
      >
        <Text style={ styles.buttonText } >Register Here</Text>
      </TouchableOpacity>
        
    </View>
  );
};

const styles = StyleSheet.create({
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
});