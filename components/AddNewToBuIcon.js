import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import style from '../styles/Styles';

export const AddNewToBuIcon = ({onPress}) => {

    return(
        <View style={style.addNewIcon}>
            <IconButton
                icon='plus-circle'
                iconColor ='#80D4F5'
                size={50}
                onPress={onPress}
            />
        </View>
    )
}