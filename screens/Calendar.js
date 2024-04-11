import { StyleSheet, Text, View } from 'react-native';
import style from "../styles/Styles"
import { LinearGradientBG } from '../components/LinearGradientBG';

export default function Calendar() {
    return (
        <View style={style.container}>
            <LinearGradientBG />
            <Text style={style.text}>Calendar comes here</Text>
        </View>
        )
}