
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore'
import { db, TODOS_REF, USERS_REF } from '../firebase/Config';
import { auth } from '../firebase/Config';
import { logout } from '../components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import style from "../styles/Styles"
import { LinearGradientBG } from '../components/LinearGradientBG';
import { TodoItem } from '../components/TodoItem';
import { Icon, IconButton } from 'react-native-paper';
import { AddNewToBuIcon } from '../components/AddNewToBuIcon';
import { AddNewToBuModal } from '../components/AddNewToBuModal';

export default function Todos({ navigation }) {

  const [newTodo, setNewTodo] = useState('')
  const [todos, setTodos] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        const subColRef = collection(
          db, USERS_REF, auth.currentUser.uid, TODOS_REF)
          onSnapshot(subColRef, (querySnapshot) => {
            setTodos(querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })))
          })
      } else {
        setIsLoggedIn(false)
      }    
    })    
  }, [])
  
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

  const removeTodo = async (id) => {
    try {
      const subColRef = 
      collection(db, USERS_REF, auth.currentUser.uid, TODOS_REF)
      await deleteDoc(doc(subColRef, id));
    } catch (error) {
      console.log(error.message);
    }
  }

  const removeTodoS = async() => {
    try {      
      todos.forEach((todo) => {
        removeTodo(todo.id)
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  const filterTodos = (done) => {
    return todos.filter((obj) => obj.done === done).length
  }

  const createTwoButtonAlert = () => Alert.alert(
    'Todolist', 'Remove all items?', [{
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
  {text: 'OK', onPress: () => removeTodoS()
  }],
  {cancelable: false}
  )

  const handlePressLogout = () => {
    logout()
  }

  let todosKeys = Object.keys(todos)

  if (!isLoggedIn) {
    return(
        <View style={style.container}>
        <LinearGradientBG/>
            <View style={style.headerItem}>
            <Text style={style.header}>Loading..</Text>
            </View>
        </View>                
    )
} else {
  return (
    <View style={style.container}>
      <LinearGradientBG/>
      <View style={style.headerItem}>
      <IconButton
        icon="account-circle"
        iconColor='#F1F3F4'
        size={40}
        onPress={() => navigation.navigate('Profile')}
      />
      <Text style={style.header}>My todolist ({todosKeys.length})</Text>
      <IconButton
        icon="logout"
        iconColor='#F1F3F4'
        size={24}
        onPress={handlePressLogout}
      />
      </View>
      <View style={style.newItem}>
        <TextInput 
        style={style.textInput} 
        placeholder='Add new todo'
        value={newTodo}
        onChangeText={setNewTodo}/>
      </View>
      <View style={style.buttonStyle}>
        <Button
        title='Add new todo item'
        onPress={() => addNewTodo()}
        />
      </View>
      <Text style={style.subheader}>
        UnChecked ({filterTodos(false)})
      </Text>
      <View style={style.todosContainer}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {todosKeys.length > 0 ? (
            todosKeys.map((key, i) => (
              !todos[i].done &&
              <TodoItem
              key={key}
              todoItem={todos[i].todoItem}
              done={todos[i].done}
              todoId={todos[key].id}
              />
            ))
          ) : (
            <Text style={style.infoText}>
              There are no items.
            </Text>
          )}
        </ScrollView>
      </View>
      <Text style={style.subheader}>
        Checked ({filterTodos(true)})
      </Text>
      <View style={style.todosContainer}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {todosKeys.length > 0 ? (
            todosKeys.map((key, i) => (
              todos[i].done &&
              <TodoItem
              key={key}
              todoItem={todos[i].todoItem}
              done={todos[i].done}
              todoId={todos[key].id}
              />
            ))
          ) : (
            <Text style={style.infoText}>
              There are no items.
            </Text>
          )}
        </ScrollView>
      </View>
      <View style={style.buttonStyle}>
        <Button
        title='remove all todos'
        onPress={() => createTwoButtonAlert()}
        />
      </View>
      <AddNewToBuModal isVisible={modalVisible} onClose={()=> setModalVisible(false)}/>
      <AddNewToBuIcon onPress={()=> setModalVisible(true)}/>
    </View>
  );
}
}