import { Pressable, Text, View } from "react-native"
import style from "../styles/Styles"
import React, { useState } from 'react'
import { collection, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db, TODOS_REF, USERS_REF } from '../firebase/Config'
import { MaterialIcons } from '@expo/vector-icons'
import EnTypo from '@expo/vector-icons/Entypo'
import { auth } from '../firebase/Config'
import { set } from "firebase/database"

const unchecked_background = '#c8e6f1'
const checked_background = '#e1f1c3'

export const TodoItem = ({todoItem: todoItem, done: done, todoId: todoId, themeColor: themeColor}) => {

    const [doneState, setDone] = useState(done)
    const [changeThemeColor, setchangeThemeColor] = useState(themeColor)

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

        // const updateThemeColor = async() => {
        //     try {
        //         const subColRef = collection(
        //             db, USERS_REF, auth.currentUser.uid, TODOS_REF
        //         )
        //         await updateDoc(doc(subColRef, todoId), {
        //             themeColor: changeThemeColor
        //         }) 
        //     } catch (error) {
        //         console.log('Themecolor not working', error.message);
        //     }
        // }

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

    return(
        <View style={[style.todoItem, {borderColor: themeColor}]}>
            <Pressable onPress={onCheck}>
                {doneState 
                ? <MaterialIcons name={'check-box'} size={32} color={themeColor}/>
                : <MaterialIcons name={'check-box-outline-blank'} size={32} color={themeColor}/>
                }
            </Pressable>
            <Text
            //style={{backgroundColor: done ? checked_background : unchecked_background}}
            style={{color: themeColor, fontSize: 16, width: '80%'}}
            onPress={onCheck}
            >
              {todoItem}  
            </Text>
            <MaterialIcons name={'circle'} size={32} color={themeColor} />
            {done &&
            <Pressable>
                <EnTypo name={'trash'} size={32} color={'black'} onPress={onRemove}/>
            </Pressable>
            }
        </View>
    )
}