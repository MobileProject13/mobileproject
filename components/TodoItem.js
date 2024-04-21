import { Pressable, View } from "react-native"
import style from "../styles/Styles"
import React, { useState, useContext } from 'react'
import { collection, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db, TODOS_REF, USERS_REF } from '../firebase/Config'
import { MaterialIcons } from '@expo/vector-icons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { auth } from '../firebase/Config'
import { ToggleThemesContext } from "./Context"
import { Text } from "react-native-paper"


export const TodoItem = ({todoItem: todoItem, done: done, todoId: todoId, themeColor: themeColor}) => {

    const [doneState, setDone] = useState(done)

    const onCheck = async() => {
        try {
            setDone(!doneState)
            const subColRef = collection(
                db, USERS_REF, auth.currentUser.uid, TODOS_REF
            )
            await updateDoc(doc(subColRef, todoId), {
                done: !doneState
            })
        }
        catch (error) {
            console.log(error.message);
        }}

        const onRemove = async() => {
            try {
                const subColRef = collection(
                    db, USERS_REF, auth.currentUser.uid, TODOS_REF
                )
                await deleteDoc(doc(subColRef, todoId))
            }
            catch (error) {
                console.log(error.message);
            }
        }

    const {theme} = useContext(ToggleThemesContext)

    return(
        <View style={[style.todoItem, { backgroundColor: theme.colors.background, borderColor: themeColor}]}>
            <Pressable onPress={onCheck}>
                {doneState 
                ? <MaterialIcons name={'check-box'} size={32} color={themeColor}/>
                : <MaterialIcons name={'check-box-outline-blank'} size={32} color={themeColor}/>
                }
            </Pressable>
            <Text            
            style={style.todoItemText}
            onPress={onCheck}
            >
              {todoItem}  
            </Text>            
            <MaterialCommunityIcons name={'trash-can-outline'} size={32} color={themeColor} onPress={onRemove}/>
        </View>
    )
}