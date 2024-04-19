import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import style from '../styles/Styles';

//This component is the PLUS in the bottom left side, 
//you can use this in your component and pass the onPress function to it

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