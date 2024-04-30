
import React, { useEffect, useState, useContext } from 'react';
import { Alert, ScrollView, View, ImageBackground } from 'react-native';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore'
import { db, TODOS_REF, USERS_REF } from '../firebase/Config';
import { auth } from '../firebase/Config';
import { onAuthStateChanged } from 'firebase/auth';
import style from "../styles/Styles"
import { LinearGradientBG } from '../components/LinearGradientBG';
import { TodoItem } from '../components/TodoItem';
import { Button, Text, List, IconButton} from 'react-native-paper';
import { AddNewToBuIcon } from '../components/AddNewToBuIcon';
import { AddNewTodoModal } from '../components/AddNewTodoModal';
import  AvatarIconNavigatesProfile  from '../components/AvatarIconNavigatesProfile';
import { ShareNotification } from '../components/SharedTodoNotification';
import { BGImageContext, ToggleThemesContext} from '../components/Context';
import { blue } from '../components/Colors';

export default function Todos({ navigation }) {

  const [todos, setTodos] = useState([])
  const [owners, setOwners] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false); 
  const [ownerExpanded, setOwnerExpanded] = useState(false)

  const { selectedBGImg } = useContext(BGImageContext);
  const {theme} = useContext(ToggleThemesContext)

  useEffect(() => {
    let unsubscribe;
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true)
        const userRef = doc(db, USERS_REF, user.uid)
        const userSnap = await getDoc(userRef)
        const userNickname = userSnap.exists() ? userSnap.data().nickname : null
        
        const subColRef = collection(
          db, USERS_REF, auth.currentUser.uid, TODOS_REF)
          unsubscribe = onSnapshot(subColRef, (querySnapshot) => {
            const fetchedTodos = querySnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }))
            setTodos(fetchedTodos)
            const fetchedOwners = [...new Set(fetchedTodos.map(todo => todo.todoOwner).filter(owner => owner && owner !== userNickname))]
            setOwners(fetchedOwners)
          })
      } else {
        setIsLoggedIn(false)
        if (unsubscribe) unsubscribe();
      }    
    }) 
    return () => {
      if (unsubscribe) unsubscribe();
    }  
  }, [])

  const handlePressExpanded = () => setExpanded(!expanded);
  const handlePressCategories = () => setCategoriesExpanded(!categoriesExpanded);
  const handlePressOwners = () => setOwnerExpanded(!ownerExpanded)

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
      <ImageBackground source={selectedBGImg} style={{flex:1}} >
      <View style={style.headerItem}>
        <Text style={style.h2text}>My todolist ({todosKeys.length})</Text>
        <AvatarIconNavigatesProfile navigation={navigation}/>
        <ShareNotification />
      </View>
        <View style={{width: '90%', alignSelf: 'center', marginBottom: 20}}>      
          <List.Accordion
            id='0'
            style={{borderWidth:2, borderColor: blue, borderRadius: 10}}
            title="FILTER OPTIONS"
            left={props => <List.Icon {...props} icon="folder" color={theme.colors.text} />}
            expanded={expanded}
            onPress={handlePressExpanded}
            >
              <List.Item
                style={{ borderBottomWidth: 2, borderColor: blue}}  
                title='All'
                onPress={() => {
                  setFilter('All');
                  setExpanded(false);
                }}
                />
                <List.Item
                style={{ borderBottomWidth: 2, borderColor: blue}}  
                title='Not Done'
                onPress={() => {
                  setFilter('Not Done')
                  setExpanded(false);
                }}
                />
                <List.Item
                style={{ borderBottomWidth: 2, borderColor: blue}}  
                title='Done'
                onPress={() => {
                  setFilter('Done')
                  setExpanded(false);
                }}
                />
                {todosKeys.some(key => todos[key].category) && (      
                <List.Accordion
                  id='1'
                  style={{borderWidth:2, borderColor: blue, borderRadius: 10}}
                  title="CATEGORIES"
                  left={props => <List.Icon {...props} icon="folder" color={theme.colors.text} />}
                  expanded={categoriesExpanded}
                  onPress={handlePressCategories}>                          
                  {
                  [...new Set(todosKeys.filter(key => todos[key].category).map(key => todos[key].category))].map((category, i) => (
                    <List.Item
                      style={{ borderBottomWidth: 2, borderColor: blue}} 
                      key={i} 
                      title={category}
                      onPress={()=> {
                        setFilter('Categories')
                        setSelectedCategory(category)
                        setCategoriesExpanded(false)
                        setExpanded(false);
                      }} 
                      />
                  ))
                  }
                  </List.Accordion>                
              )}
              {owners.length > 0 && (
              <List.Accordion
              id='2'
              style={{borderWidth:2, borderColor: blue, borderRadius: 10}}
              title="SHARED TODOS"
              left={props => <List.Icon {...props} icon="account-circle" color={theme.colors.text} />}
              expanded={ownerExpanded}
              onPress={handlePressOwners}
              >
                {owners.map((owner, index) => (
                  <List.Item
                  style={{ borderBottomWidth: 2, borderColor: blue}}
                  key={index}
                  title={owner}
                  onPress={() => {
                    setFilter('Owner')
                    setSelectedCategory(owner)
                    setOwnerExpanded(false)
                    setExpanded(false)
                  }}
                  />
                ))}
              </List.Accordion>
            )}        
            </List.Accordion>

        </View>
      <View style={style.innercontainer}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
              {todosKeys.length > 0 ? (
          <>
          {todosKeys.filter(key => {
            if (filter === 'All') return true;
            if (filter === 'Not Done') return !todos[key].done;
            if (filter === 'Done') return todos[key].done;
            if (filter === 'Categories') return todos[key].category === selectedCategory;
            if (filter === 'Owner') return todos[key].todoOwner === selectedCategory
          }).map((key, i) => (
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
          <>
          <Text style={style.h2text}>No todos yet.</Text>
          <Text style={style.infoText}>Start by pressing the </Text>
          <IconButton
          style={{alignSelf: 'center'}}
                icon='plus-circle'
                iconColor ={blue}
                size={80}
                onPress={() => setModalVisible(true)}
            />
          <Text style={style.infoText}> here or on the bottom left.</Text>
          </>
        )}
        </ScrollView>
       { todosKeys.length > 0 &&        
        <Button
          icon='delete'
          style={style.buttonsWide}
          mode='contained'
          onPress={() => createTwoButtonAlert()}
        >
        REMOVE ALL TODOS
        </Button>}
      </View>      
      <AddNewTodoModal isVisible={modalVisible} onClose={()=> setModalVisible(false)} todosKeys={todosKeys} todos={todos}/>
      <View style={style.viewbottom}/>
      <AddNewToBuIcon onPress={()=> setModalVisible(true)}/>  
      </ImageBackground>    
    </View>
  );
}
}