import { Modal, Portal, Text, Button, TextInput } from 'react-native-paper';
import style from '../styles/Styles';
import { View } from 'react-native';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth, USERS_REF, TODOS_REF } from '../firebase/Config';

export const AddNewTodoModal = ({isVisible, onClose}) => {

    const [newTodo, setNewTodo] = useState('')

    const addNewTodo = async () => {
        try {
          if (newTodo.trim() !== '') {
            const subColRef = collection(
              db, USERS_REF, auth.currentUser.uid, TODOS_REF)
            await addDoc(subColRef, {
              done: false,
              todoItem: newTodo
            })
            setNewTodo('')
          }
        } catch (error) {
          console.log(error.message);
        }
      }

    return(
        <Portal>
            <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={style.addNewtodoModal} >
                <Text style={style.h2text}>Add new Todo</Text>
                <TextInput
                mode="outlined"
                style={[style.textInput, style.marginbottomsmall]}
                selectionColor='#F1F3F4'
                activeOutlineColor='#D5F67F'                
                label='Enter new todo'                
                value={newTodo}
                onChangeText={setNewTodo}/>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Button
                textColor= '#F1F3F4'
                style={style.buttonSmall}
                mode='contained' 
                onPress={addNewTodo}>Add</Button>
                <Button
                textColor= '#F1F3F4'
                style={style.buttonSmall}
                mode='contained' 
                onPress={onClose}>Done</Button>
                </View>
            </Modal>
        </Portal>
    )    
}