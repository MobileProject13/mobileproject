import { Text, View } from 'react-native';
import style from "../styles/Styles"
import { LinearGradientBG } from '../components/LinearGradientBG';


export default function Budget() {
    return (
        <View style={style.container}>
            <LinearGradientBG />
            <Text style={style.text}>Budget comes here</Text>
        </View>
        )
}