import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
} from 'react-native';
import * as Linking from 'expo-linking';


export default function HelplineScreen({ navigation }) {
  return (
    <View style={ styles.mainContainer } >
      {/* TODO: add hotlines, and maybe directly call using phone */}
      <View style={ styles.helplineContainerTop } >
        <Text style={ styles.groupTitle } >NS Hotlines</Text>

        <View style={ styles.helplineEntry } >
          <Text>Calling from Singapore{' '}</Text>
          <Text 
            style={ styles.clickableTel }
            onPress={ () => { Linking.openURL('tel:1800-3676767') } } 
          >
            1800-3676767
          </Text>
          {/* <Text>(1800-eNSNSNS)</Text> */}
        </View>

        <View style={ styles.helplineEntry } >
          <Text>Calling from overseas{' '}</Text>
          <Text 
            style={ styles.clickableTel }
            onPress={ () => { Linking.openURL('tel:+65-6567-6767') } } 
          >
            +65-6567-6767
          </Text>
        </View>

        <View style={ styles.helplineEntry } >
          <Text>24-hour counselling hotline{' '}</Text>
          <Text 
            style={ styles.clickableTel }
            onPress={ () => { Linking.openURL('tel:1800-278-0022') } } 
          >
            1800-278-0022
          </Text>
        </View>

        
      </View>
      
      <View style={ styles.helplineContainerBottom } >
        <Text style={ styles.groupTitle } >Mental Well-being</Text>

        <View style={ styles.helplineEntry } >
          <Text>National Care Hotline{' '}</Text>
          <Text 
            style={ styles.clickableTel }
            onPress={ () => { Linking.openURL('tel:1800-202-6868') } } 
          >
            1800-202-6868
          </Text>
        </View>

        <View style={ styles.helplineEntry } >
          <Text 
            style={ styles.clickableWeb }
            onPress={ () => { Linking.openURL('http://www.ec2.sg/') } } 
          >
            Fei Yue’s Online Counselling Service
          </Text>
        </View>

        <View style={ styles.helplineEntry } >
          <Text>IMH’s Mental Health Helpline{' '}</Text>
          <Text 
            style={ styles.clickableTel }
            onPress={ () => { Linking.openURL('tel:+65-6389-2222') } } 
          >
            6389-2222
          </Text>
        </View>

        <View style={ styles.helplineEntry } >
          <Text>Samaritans of Singapore{' '}</Text>
          <Text 
            style={ styles.clickableTel }
            onPress={ () => { Linking.openURL('tel:1800-221-4444') } } 
          >
            1800-221-4444
          </Text>
        </View>

        <View style={ styles.helplineEntry } >
          <Text
            style={ styles.clickableWeb }
            onPress={ () => { Linking.openURL('http://www.silverribbonsingapore.com/') } }
          >
            Silver Ribbon Singapore{' '}
          </Text>
          <Text 
            style={ styles.clickableTel }
            onPress={ () => { Linking.openURL('tel:+65-6385-3714') } } 
          >
            6385-3714
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
    marginHorizontal: '10%',
  },

  helplineContainerTop: {
    flex: 0.4,
    width: '100%',
    borderColor: '#5a792c',
    borderWidth: 5,
    borderRadius: 10,
    marginBottom: '10%',
    padding: 10,
  },

  helplineContainerBottom: {
    flex: 0.6,
    width: '100%',
    borderColor: '#5a792c',
    borderWidth: 5,
    borderRadius: 10,
    marginBottom: '10%',
    padding: 10,
  },

  helplineEntry: {
    flexDirection: 'row',
    flex: 1,
    marginVertical: 5,
    alignContent: 'space-between',
    justifyContent: 'space-between',
  },

  groupTitle: {
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  clickableWeb: {
    // fontSize: 18,
    color: "blue",
    // fontWeight: "bold",
    // alignSelf: "center",
    // textTransform: "uppercase",
  },

  clickableTel: {
    fontFamily: 'consolas',
    textDecorationLine: 'underline',
  },
});