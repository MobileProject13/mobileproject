import { Badge, Text, Button, Modal, Portal } from "react-native-paper";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, query, where, onSnapshot, deleteDoc, doc, setDoc, getDoc, QuerySnapshot } from "firebase/firestore";
import { useCallback, useState, useEffect, useContext } from "react";
import { SHAREDTODOS_REF, TODOS_REF, USERS_REF, auth } from "../firebase/Config";
import { db } from "../firebase/Config";
import style from "../styles/Styles";
import { ToggleThemesContext } from './Context'

export const ShareNotification = () => {

    // Constants for array to fetched sharedTodos, displaying modal, selecting todo and username

    const [sharedTodos, setSharedTodos] = useState([])
    const [ModalVisible, setModalVisible] = useState(false)
    const [selectedTodo, setSelectedTodo] = useState(null)
    const [userNickname, setUserNickname] = useState('')

    const {theme} = useContext(ToggleThemesContext)

    // useEffect checks user data, who user is and set users nickname from Firestore to userNickname state

    useEffect(() => {       
            const fetchUserDetails = async () => {
                const userRef = doc(db, USERS_REF, auth.currentUser.uid)
                const userSnap = await getDoc(userRef)
                if (userSnap.exists()){
                    setUserNickname(userSnap.data().nickname)
                    console.log("SetUserNickname data(): ", userSnap.data().nickname);
                }
            }
            fetchUserDetails()
        }, [])

        // useFocusEffect checks at everytime screen is focused that userNickname has value and query sharedTodos to find where ´sharedTo´ and userNickname is equal
        // and listens when query has changes. Document data is const todos and then setted to sharedTodos state.
        useFocusEffect(
            useCallback(() => {
                if(userNickname) {
                    const q = query(collection(db, SHAREDTODOS_REF), where("sharedTo", "==", userNickname))
                    const unsubscribe = onSnapshot(q, (querySnapshot) => {
                        const todos = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data() }))
                        setSharedTodos(todos)
                })
                    return () => unsubscribe()
            }
            console.log("Usefocus username:", userNickname);
        }, [userNickname])
    )

    // handleAccept is asynchronous function that when user accepts incoming shared todo that it cuts out three values: sharedDate, sharedTo and category and rest of the todoData is todo.
    // then then todo is added users own todo database and lastly it deletes todo from sharedTodos and closes Modal window
    const handleAccept = async (todo) => {
        const {sharedDate, sharedTo, category, ...todoData} = todo
        const todoId = todo.id
        const userTodoRef = doc(db, USERS_REF, auth.currentUser.uid, TODOS_REF, todoId)
        await setDoc(userTodoRef, todoData)

        await deleteDoc(doc(db, "sharedTodos", todoId))
        setModalVisible(false)
    }

    // If user rejects shared todo from other user it deletes it from sharedTodos collection and closes Modal window
    const handleReject = async (todo) => {
        await deleteDoc(doc(db, "sharedTodos", todo.id))
        setModalVisible(false)
    }

    //Open modal sets todo to selectedTodo state and displays Modal window
    const openModal = (todo) => {
        setSelectedTodo(todo)
        setModalVisible(true)
    }

    // In rendering if sharedTodos array state is greater than 0 it shows Badge component from react native paper library and indicates how many shared todos is waiting for attention
    // and clicking Badge it opens openModal which opens Modal window where user see who is sharing todo and can accept or reject shared todo
    return(
        <View>
            {sharedTodos.length > 0 &&(
                <Badge size={24} onPress={() => openModal(sharedTodos[0])}>{sharedTodos.length}</Badge>
            )}
            <Portal>
                <Modal visible={ModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[style.addNewtodoModal, {backgroundColor: theme.colors.background}]}>
                    <Text>Do you accept the shared todo from: {selectedTodo?.todoOwner}</Text>
                    <View style={[{marginTop: 20}, {flexDirection: 'row', justifyContent: 'center'}]}>
                        <Button onPress={() => handleReject(selectedTodo)} mode="contained" style={[style.buttonSmall, {marginTop: 20, marginRight: 20}]}>Reject</Button>
                        <Button onPress={() => handleAccept(selectedTodo)} mode="contained" style={[style.buttonSmall, {marginTop: 20}]}>Accept</Button>
                    </View>
                </Modal>
            </Portal>
        </View>
        
    )
}