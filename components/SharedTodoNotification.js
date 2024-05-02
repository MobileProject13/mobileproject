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

    const [sharedTodos, setSharedTodos] = useState([])
    const [ModalVisible, setModalVisible] = useState(false)
    const [selectedTodo, setSelectedTodo] = useState(null)
    const [userNickname, setUserNickname] = useState('')

    const {theme} = useContext(ToggleThemesContext)

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

    const handleAccept = async (todo) => {
        const {sharedDate, sharedTo, ...todoData} = todo
        const todoId = todo.id
        const userTodoRef = doc(db, USERS_REF, auth.currentUser.uid, TODOS_REF, todoId)
        await setDoc(userTodoRef, todoData)

        await deleteDoc(doc(db, "sharedTodos", todoId))
        setModalVisible(false)
    }

    const handleReject = async (todo) => {
        await deleteDoc(doc(db, "sharedTodos", todo.id))
        setModalVisible(false)
    }

    const openModal = (todo) => {
        setSelectedTodo(todo)
        setModalVisible(true)
    }

    return(
        <View>
            {sharedTodos.length > 0 &&(
                <Badge size={24} onPress={() => openModal(sharedTodos[0])}>{sharedTodos.length}</Badge>
            )}
            <Portal>
                <Modal visible={ModalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={[style.addNewtodoModal, {backgroundColor: theme.colors.background}]}>
                    <Text>Do you accept the shared todo from: </Text>
                    <View style={[{marginTop: 20}, {flexDirection: 'row', justifyContent: 'center'}]}>
                        <Button onPress={() => handleReject(selectedTodo)} mode="contained" style={[style.buttonSmall, {marginTop: 20, marginRight: 20}]}>Reject</Button>
                        <Button onPress={() => handleAccept(selectedTodo)} mode="contained" style={[style.buttonSmall, {marginTop: 20}]}>Accept</Button>
                    </View>
                </Modal>
            </Portal>
        </View>
        
    )
}