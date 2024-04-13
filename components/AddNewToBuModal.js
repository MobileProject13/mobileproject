import { Modal, Portal, Text, Button } from 'react-native-paper';

export const AddNewToBuModal = ({isVisible, onClose}) => {


    return(
        <Portal>
            <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
                <Text>Example Modal</Text>
                <Button onPress={onClose}>Close</Button>
            </Modal>
        </Portal>
    )    
}