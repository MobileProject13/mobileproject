import { Modal, Portal, Text, Button, TextInput, RadioButton } from 'react-native-paper';
import style from '../styles/Styles';
import { View } from 'react-native';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth, USERS_REF, TODOS_REF } from '../firebase/Config';
import { set } from 'firebase/database';

export const AddNewTodoModal = ({isVisible, onClose}) => {

    const [newTodo, setNewTodo] = useState('')
    const [themeColor, setThemeColor] = useState('#80D4F5')
    const [changeThemeColor, setchangeThemeColor] = useState(themeColor)
    const [isColorModalVisible, setIsColorModalVisible] = useState(false)

    const openColorModal = () => {
      setIsColorModalVisible(true)
    }

    const closeColorModal = () => {
      setIsColorModalVisible(false)
    }

    const addNewTodo = async () => {
        try {
          if (newTodo.trim() !== '') {
            const subColRef = collection(
              db, USERS_REF, auth.currentUser.uid, TODOS_REF)
            await addDoc(subColRef, {
              done: false,
              todoItem: newTodo,
              themeColor: themeColor
            })
            setNewTodo('')
            setThemeColor('#80D4F5')
          }
        } catch (error) {
          console.log(error.message);
        }
      }

    const updateThemeColor = async() => {
            try {
                const subColRef = collection(
                    db, USERS_REF, auth.currentUser.uid, TODOS_REF
                )
                await updateDoc(doc(subColRef, todoId), {
                    themeColor: changeThemeColor
                }) 
            } catch (error) {
                console.log('Themecolor not working', error.message);
            }
        }

    return(
        <Portal>
            <Modal 
                visible={isVisible} 
                onDismiss={onClose} 
                contentContainerStyle={style.addNewtodoModal} >
              <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={style.h2text}>Add new Todo</Text>
                <TextInput
                    mode="outlined"
                    style={[style.textInput, style.marginbottomsmall]}
                    selectionColor='#F1F3F4'
                    activeOutlineColor='#D5F67F'                
                    label='Enter new todo'                
                    value={newTodo}
                    onChangeText={setNewTodo}/>
                <Button
                    textColor= '#F1F3F4'
                    style={style.buttonSmall}
                    mode='contained'
                    onPress={openColorModal}
                    > Colors
                </Button>
                
                </View>
                  
                <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
                <Button
                    textColor= '#F1F3F4'
                    style={style.buttonSmall}
                    mode='contained' 
                    onPress={addNewTodo}>
                    Add
                </Button>
                <Button
                    textColor= '#F1F3F4'
                    style={style.buttonSmall}
                    mode='contained' 
                    onPress={onClose}>
                    Done
                </Button>
                </View>
              
            </Modal>
            <ChooseColors visible={isColorModalVisible} onClose={closeColorModal}/> 
        </Portal>
    )    
}

const ChooseColors = ({visible, onClose}) => {

    const [colorvalue, setColorValue] = useState('#80D4F5')

    return(
        <Modal
          visible={visible}
          onDismiss={onClose}
          contentContainerStyle={{backgroundColor: 'black', padding: 20, borderRadius: 10, width: '80%', alignSelf: 'center'}}          
        >
          <RadioButton.Group onValueChange={newValue => setColorValue(newValue)} value={colorvalue}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View>
                <Text>Blue: </Text>
                <RadioButton value="#80D4F5" />
              </View>
              <View>
                <Text>Green: </Text>
                <RadioButton value='#D5F67F' />
              </View>
              <View>
                <Text>Pink: </Text>
                <RadioButton value='#F67FD4' />
              </View>
            </View>
          </RadioButton.Group>
        </Modal>
    )
}