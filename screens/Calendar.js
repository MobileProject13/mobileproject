import { StyleSheet, Text, View } from 'react-native';
import style from "../styles/Styles"
import { LinearGradientBG } from '../components/LinearGradientBG';
import CalendarView from '../components/CalendarView';

export default function Calendar() {
    return (
        <View style={style.container}>
            <LinearGradientBG />
            <Text style={[style.h2text, {marginBottom: 20}]}>Calendar is here</Text>
            <CalendarView/>
        </View>
        )
}