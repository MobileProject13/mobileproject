import { useState, useContext } from "react";
import { Modal, Portal, Text, Button, TextInput, RadioButton, Snackbar } from 'react-native-paper';
import style from "../styles/Styles";
import { ToggleThemesContext } from './Context'
import { USERS_REF, TODOS_REF, SHAREDTODOS_REF, db, auth } from "../firebase/Config";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";

export const ShareTodoModal = ({todoId, onCancel, visible}) => {

  //Constants for nickname, showing a modal and for themes
    const [nickname, setNickname] = useState('')
    const [modalVisible, setModalVisible] = useState(false)

    const {theme} = useContext(ToggleThemesContext)

    const showModal = () => setModalVisible(true)
    //This constant closes the modal window
    const hideModal = () => {
        setModalVisible(false)
        if(typeof onCancel === 'function') {
            onCancel()
        }
    }

    // Constant handleShare gets users id and todos id as well. Creates a collection if its not created yet and adds a document adding two field: "sharedDate and sharedTo" 
    // and hides Modal window
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
    

    //Rendering modal window with TextInput and buttons for handleShare function and hideModal function.
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