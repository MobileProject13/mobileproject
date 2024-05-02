import { useState, useContext } from "react";
import { Modal, Portal, Text, Button, TextInput, RadioButton } from 'react-native-paper';
import style from "../styles/Styles";
import { ToggleThemesContext } from './Context'
import { USERS_REF, TODOS_REF, SHAREDTODOS_REF, db, auth } from "../firebase/Config";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

export const ShareTodoModal = ({todoId, onCancel, visible}) => {
    const [nickname, setNickname] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const {theme} = useContext(ToggleThemesContext)

    const showModal = () => setModalVisible(true)
    const hideModal = () => {
        setModalVisible(false)
        if(typeof onCancel === 'function') {
            onCancel()
        }
    }

    const handleShare = async () => {
        try {
            const user = auth.currentUser
            if(user) {
                const userId = user.uid
                console.log("Current user ID: ", userId, "Shared todo ID: ", todoId);
                const todoRef = doc(db, USERS_REF, userId, TODOS_REF,todoId )
                const todoDoc = await getDoc(todoRef)
                if (todoDoc.exists()) {
                    const todoData = todoDoc.data()
    
                    const sharedRef = collection(db, SHAREDTODOS_REF)
    
                    const result = await addDoc(sharedRef, {
                        ...todoData,
                        sharedDate: new Date(),
                        sharedTo: nickname
                        
                    })
                    console.log("Todo shared succesfully with ID: ", result.id);
                } else {
                    console.log("No todo found for todo ID: ", todoId);
                } 
            } else {
                console.log("User not logged in");
            }
    
        } catch (error) {
            console.log("Error sharing the doto", error);
        } 
        hideModal()
    }

    

    return (
      <Portal>
        <Modal visible={visible} onDismiss={onCancel} contentContainerStyle={[style.addNewtodoModal, {backgroundColor: theme.colors.background}]}>
            <Text>Write a nickname of user to share your todo</Text>
          <TextInput
            label="Nickname"
            value={nickname}
            onChangeText={setNickname}
            mode="outlined"
          />
          <Button onPress={handleShare} mode="contained" style={[style.buttonSmall, {marginTop: 20}]} >
            Share
          </Button>
          <Button onPress={hideModal} mode="contained" style={[style.buttonSmall, {marginTop: 10}]} >
            Cancel
          </Button>
        </Modal>
      </Portal>
    )

}