import { Modal, Portal, Text, Button, TextInput, RadioButton, Snackbar, List } from 'react-native-paper';
import style from '../styles/Styles';
import { View } from 'react-native';
import { useState, useContext } from 'react';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { db, auth, USERS_REF, TODOS_REF } from '../firebase/Config';
import { MaterialIcons } from '@expo/vector-icons'
import { Calendar } from "react-native-calendars"
import { blue, pink, green, lightcolor } from "../components/Colors";
import { ToggleThemesContext } from './Context';

//modal to add new todo item

export const AddNewTodoModal = ({isVisible, onClose, todosKeys, todos}) => {

    const {theme} = useContext(ToggleThemesContext)

    const [newTodo, setNewTodo] = useState('')
    const [themeColor, setThemeColor] = useState('#80D4F5')
    const [newCategorie, setNewCategorie] = useState('')
    const [isColorModalVisible, setIsColorModalVisible] = useState(false)
    const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false)
    const [date, setDate] = useState()
    const [addNotification, setAddNotification] = useState(false)
    const [nameForTodoNotification, setNameForTodoNotification] = useState(false)
    const [expanded, setExpanded] = useState(false); 

    const openColorModal = () => setIsColorModalVisible(true)

    const closeColorModal = () => setIsColorModalVisible(false)

    const selectThemeColor = (color) => setThemeColor(color)

    const openCalendarModal = () => setIsCalendarModalVisible(true)
    const closeCalendarModal = (day) => {
      setIsCalendarModalVisible(false)
      setDate(day)
    }

    const handlePressExpanded = () => setExpanded(!expanded);

    let datePicked = date ? date?.dateString : 'Date'

    const addNewTodo = async () => {

      const IsDateChosen = date ? date : ''
      const IsCategoryChosen = newCategorie ? newCategorie : ''

      if (newTodo.trim() === '') {
        return setNameForTodoNotification(true)
      }

        try {
          if (newTodo.trim() !== '') {
            const subColRef = collection(
              db, USERS_REF, auth.currentUser.uid, TODOS_REF)
            const docRef = doc(db, USERS_REF, auth.currentUser.uid)
            const docSnap = await getDoc(docRef)
            const userData = docSnap.data()
            await addDoc(subColRef, {
              done: false,
              todoItem: newTodo,
              themeColor: themeColor,
              todoDate: IsDateChosen,
              todoOwner: userData.nickname,
              category: IsCategoryChosen
            })
            setNewTodo('')
            setThemeColor('#80D4F5')
            setDate()
            setNewCategorie('')
            setAddNotification(true)
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
                contentContainerStyle={[style.addNewtodoModal, {backgroundColor: theme.colors.background}]} >
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
                  <TextInput
                    mode="outlined"
                    style={[style.textInput, style.marginbottomsmall]}
                    selectionColor={lightcolor}
                    activeOutlineColor={green}                
                    label='Enter new Category'
                    right={<TextInput.Icon icon={() => <MaterialIcons name="folder" size={24} color={theme.colors.text} />} />}                
                    value={newCategorie}
                    onChangeText={setNewCategorie}/>
                    <Text style={style.infoText}>or choose Category from list:</Text>                    
                    </View>
                    {todosKeys.length > 0 ? (
                      <>
                        <List.Accordion
                          style={{ borderWidth:2, borderColor: blue, borderRadius: 10}}
                          title="CATEGORIES"
                          left={props => <List.Icon {...props} icon="folder" color={theme.colors.text} />}
                          expanded={expanded}
                          onPress={handlePressExpanded}>                          
                          {
                          [...new Set(todosKeys.filter(key => todos[key].category).map(key => todos[key].category))].map((category, i) => (
                            <List.Item
                              style={{ borderBottomWidth: 2, borderColor: blue,}} 
                              key={i} 
                              title={category}
                              onPress={()=> setNewCategorie(category)} />
                          ))
                          }
                          </List.Accordion>
                        </>
                    ) : (
                      <Text style={style.infoText}>
                        There are no categories made yet.
                      </Text>
                    )} 
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
                <Button
                    style={style.buttonSmall}
                    mode='contained'
                    onPress={openColorModal}
                    > <MaterialIcons name="circle" size={16} color={themeColor} /> Color
                </Button>
                <Button
                    icon='calendar-edit'
                    style={date ? style.buttonMedium : style.buttonSmall}
                    mode='contained'
                    onPress={openCalendarModal}
                    > {datePicked}
                </Button>
                </View>
                                 
                <View style={{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
                <Button
                    style={style.buttonSmall}
                    mode='contained' 
                    onPress={addNewTodo}>
                    Add
                </Button>
                <Button
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
            <Snackbar
            visible={addNotification}
            onDismiss={() => setAddNotification(false)}
            duration={2000}
            >
              Todo added successfully!
            </Snackbar>
            <Snackbar
            visible={nameForTodoNotification}
            onDismiss={() => setNameForTodoNotification(false)}
            duration={2000}
            >
              Add name of the todo, please!
            </Snackbar> 
        </Portal>
    )    
}

const ChooseColors = ({visible, onClose, selectThemeColor}) => {

  const {theme} = useContext(ToggleThemesContext)

    const handleColorChange = (color) => {
      selectThemeColor(color)
      onClose()
    }

    return(
        <Modal
          visible={visible}
          onDismiss={onClose}
          contentContainerStyle={[style.chooseColorModal, {backgroundColor: theme.colors.background}]}          
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

  const {theme} = useContext(ToggleThemesContext)
  
    return(
        <Modal
          visible={visible}
          onDismiss={onClose}
          contentContainerStyle={[style.chooseColorModal, {backgroundColor: theme.colors.background}]}          
        >
          <Calendar
            firstDay={1}
            theme={{
              calendarBackground: theme.colors.background,
              textSectionTitleColor: theme.colors.text,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.text,
              todayTextColor: theme.colors.text,
              dayTextColor: theme.colors.text,
              textDisabledColor: blue,
              dotColor: theme.colors.text,
              selectedDotColor: theme.colors.text,
              arrowColor: theme.colors.text,
              monthTextColor: theme.colors.text,
              textDayFontFamily: 'monospace',
              textMonthFontFamily: 'monospace',
              textDayHeaderFontFamily: 'monospace',
              textDayFontWeight: '300',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '300',
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 16
            }} 
          onDayPress={onClose}/>
        </Modal>
    )
}