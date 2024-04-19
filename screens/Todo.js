
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
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
import { onAuthStateChanged } from 'firebase/auth';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import style from "../styles/Styles"
import { LinearGradientBG } from '../components/LinearGradientBG';
import { TodoItem } from '../components/TodoItem';
import { Button, SegmentedButtons} from 'react-native-paper';
import { AddNewToBuIcon } from '../components/AddNewToBuIcon';
import { AddNewTodoModal } from '../components/AddNewTodoModal';
import  AvatarIconNavigatesProfile  from '../components/AvatarIconNavigatesProfile';

export default function Todos({ navigation }) {

  const [todos, setTodos] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filterButtons, setFilterButtons] = useState('all')

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

  let todosKeys = Object.keys(todos)

  if (!isLoggedIn) {
    return(
        <View style={style.container}>
        <LinearGradientBG/>
          <View style={style.innercontainer}>
            <Text style={style.h2text}>Loading..</Text>
          </View>
        </View>                
    )
} else {
  return (
    <View style={style.container}>
      <LinearGradientBG/>
      <View style={style.headerItem}>
        <Text style={style.h2text}>My todolist ({todosKeys.length})</Text>
        <AvatarIconNavigatesProfile navigation={navigation}/>
      </View>
      <View style={style.segmentedButtons}>
        <SegmentedButtons
        value={filterButtons}
        onValueChange={setFilterButtons}
        buttons={[
          {
            value: 'all',
            label: 'All',
          },
          {
            value: 'unchecked',
            label: 'Unchecked',
          },
          {
            value: 'checked',
            label: 'Checked',
          },
        ]}
        />
      </View>
      <View style={style.innercontainer}>

    {filterButtons === 'all' && (
      <View style={style.todosContainer}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {todosKeys.length > 0 ? (
        <>
        {todosKeys.filter(key => !todos[key].done).map((key, i) => (
          <TodoItem
          key={key}
          todoItem={todos[key].todoItem}
          done={todos[key].done}
          todoId={todos[key].id}
          themeColor={todos[key].themeColor}
          />
        ))}
        {todosKeys.filter(key => todos[key].done).map((key, i) => (
          <TodoItem
          key={key}
          todoItem={todos[key].todoItem}
          done={todos[key].done}
          todoId={todos[key].id}
          themeColor={todos[key].themeColor}
          />
        ))}
      </>
          ) : (
            <Text style={style.infoText}>
              There are no items.
            </Text>
          )}
        </ScrollView>
      </View>
    )}

    {filterButtons === 'unchecked' && (
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
              themeColor={todos[i].themeColor}
              />
            ))
          ) : (
            <Text style={style.infoText}>
              There are no items.
            </Text>
          )}
        </ScrollView>
      </View>
    )}

    {filterButtons === 'checked' && (
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
              themeColor={todos[i].themeColor}
              />
            ))
          ) : (
            <Text style={style.infoText}>
              There are no items.
            </Text>
          )}
        </ScrollView>
      </View>
    )}      
       { todosKeys.length > 0 &&        
        <Button
          icon='delete'
          textColor= '#F1F3F4'
          style={style.buttonsWide}
          mode='contained'
          onPress={() => createTwoButtonAlert()}
        >
        REMOVE ALL TODOS
        </Button>}
      </View>      
      <AddNewTodoModal isVisible={modalVisible} onClose={()=> setModalVisible(false)} />
      <View style={style.viewbottom}/>
      <AddNewToBuIcon onPress={()=> setModalVisible(true)}/>      
    </View>
  );
}
}