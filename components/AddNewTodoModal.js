import { Modal, Portal, Text, Button, TextInput, RadioButton } from 'react-native-paper';
import style from '../styles/Styles';
import { View } from 'react-native';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth, USERS_REF, TODOS_REF } from '../firebase/Config';
import { MaterialIcons } from '@expo/vector-icons'
import { Calendar } from "react-native-calendars"
import { blue, pink, green, lightcolor } from "../components/Colors";

//modal to add new todo item

export const AddNewTodoModal = ({isVisible, onClose}) => {

    const [newTodo, setNewTodo] = useState('')
    const [themeColor, setThemeColor] = useState('#80D4F5')
    const [isColorModalVisible, setIsColorModalVisible] = useState(false)
    const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false)
    const [date, setDate] = useState()

    const openColorModal = () => setIsColorModalVisible(true)    

    const closeColorModal = () => setIsColorModalVisible(false)    

    const selectThemeColor = (color) => setThemeColor(color)    

    const openCalendarModal = () => setIsCalendarModalVisible(true)    

    const closeCalendarModal = (day) => {
      setIsCalendarModalVisible(false)
      setDate(day)
    }

    let datePicked = date ? date?.dateString : 'Date'

    const addNewTodo = async () => {

      const IsDateChosen = date ? date : ''

        try {
          if (newTodo.trim() !== '') {
            const subColRef = collection(
              db, USERS_REF, auth.currentUser.uid, TODOS_REF)
            await addDoc(subColRef, {
              done: false,
              todoItem: newTodo,
              themeColor: themeColor,
              todoDate: IsDateChosen
            })
            setNewTodo('')
            setThemeColor('#80D4F5')
            setDate()
          }
        } catch (error) {
          console.log(error.message);
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
                    selectionColor={lightcolor}
                    activeOutlineColor={green}                
                    label='Enter new todo'
                    right={<TextInput.Icon icon={() => <MaterialIcons name="circle" size={24} color={themeColor} />} />}                
                    value={newTodo}
                    onChangeText={setNewTodo}/>
                    </View> 
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
                <Button
                    textColor= {lightcolor}
                    style={style.buttonSmall}
                    mode='contained'
                    onPress={openColorModal}
                    > <MaterialIcons name="circle" size={16} color={themeColor} /> Color
                </Button>
                <Button
                    icon='calendar-edit'
                    textColor= {lightcolor}
                    style={date ? style.buttonMedium : style.buttonSmall}
                    mode='contained'
                    onPress={openCalendarModal}
                    > {datePicked}
                </Button>
                </View>
                                 
                <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
                <Button
                    textColor= {lightcolor}
                    style={style.buttonSmall}
                    mode='contained' 
                    onPress={addNewTodo}>
                    Add
                </Button>
                <Button
                    textColor= {lightcolor}
                    style={style.buttonSmall}
                    mode='contained' 
                    onPress={onClose}>
                    Done
                </Button>
                </View>              
            </Modal>
            <ChooseColors 
            visible={isColorModalVisible} 
            onClose={closeColorModal} 
            selectThemeColor={selectThemeColor}/>
            <PickDate
            visible={isCalendarModalVisible}
            onClose={closeCalendarModal}
            /> 
        </Portal>
    )    
}

const ChooseColors = ({visible, onClose, selectThemeColor}) => {

    const handleColorChange = (color) => {
      selectThemeColor(color)
      onClose()
    }

    return(
        <Modal
          visible={visible}
          onDismiss={onClose}
          contentContainerStyle={style.chooseColorModal}          
        >
          <RadioButton.Group onValueChange={handleColorChange}>
            <View style={style.chooseColorRadiobuttonscolumn}>
              <View style={style.chooseColorRadiobuttonsrow}>
                <RadioButton
                  uncheckedColor={blue}
                  value={blue} />
                <Text style={style.chooseColorRadiobuttonsrowText}>Blue </Text>
              </View>
              <View style={style.chooseColorRadiobuttonsrow}>
                <RadioButton 
                  uncheckedColor={green}
                  value={green} />
                <Text style={style.chooseColorRadiobuttonsrowText}>Green </Text>
              </View>
              <View style={style.chooseColorRadiobuttonsrow}>
                <RadioButton
                  uncheckedColor={pink} 
                  value={pink} />
                <Text style={style.chooseColorRadiobuttonsrowText}>Pink </Text>
              </View>
            </View>
          </RadioButton.Group>
        </Modal>
    )
}

const PickDate = ({visible, onClose}) => {
  
    return(
        <Modal
          visible={visible}
          onDismiss={onClose}
          contentContainerStyle={style.chooseColorModal}          
        >
          <Calendar onDayPress={onClose}/>
        </Modal>
    )
}