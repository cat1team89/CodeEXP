import {
    MaterialIcons,
    MaterialCommunityIcons,
    Entypo,
    FontAwesome5,
    Ionicons
} from '@expo/vector-icons';

export const icons = {
    "orderIn": {icon: <Ionicons name="fast-food-outline" size={24} color="black" />, text: "Order In"},
    "canteen": {icon: <MaterialIcons name="restaurant" size={24} color="black" />, text: "Canteen"},
    "cookhouse": {icon: <MaterialIcons name="food-bank" size={24} color="black" />, text: "Cookhouse"},
    "nightOut": {icon: <MaterialCommunityIcons name="exit-run" size={24} color="black" />, text: "Night Out"},
    "run": {icon: <MaterialCommunityIcons name="run-fast" size={24} color="black" />, text: "Run"},
    "justChillTogether": {icon: <FontAwesome5 name="chair" size={24} color="black" />, text: "Chill"},
    "study": {icon: <Entypo name="open-book" size={24} color="black" />, text: "Study"},
};