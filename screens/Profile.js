import React, { useState, useEffect } from "react"
import { Button, Text, View, Pressable, Alert } from "react-native"
import { onAuthStateChanged } from "firebase/auth"
import { logout, changePassword, removeUser } from "../components/Auth"
import style from "../styles/Styles"
import { MaterialIcons } from '@expo/vector-icons'
import { auth, db, USERS_REF } from "../firebase/Config"
import { collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { LinearGradientBG } from "../components/LinearGradientBG"
import { TextInput, Modal, Portal } from 'react-native-paper'

export default function Profile({navigation}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [email, setEmail] = useState('')    
    const [nickname, setNickname] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    const openAccountSettingsModal = () => setIsVisible(true)

    const closeAccountSettingsModal = () => setIsVisible(false)

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {            
            if (user) {                
                setIsLoggedIn(true)
                try{(async () => {                    
                    const docRef = doc(db, USERS_REF, auth.currentUser.uid);
                    const docSnap = await getDoc(docRef);                    
                    if (docSnap.exists()) {                        
                        const userData = docSnap.data();
                        setNickname(userData.nickname)
                        setEmail(userData.email)                        
                    } else {
                        console.log('No such document')
                    }
                })();
                } catch (error) {
                    console.log('Error fetching user data:', error)
                }
            }
            else {                
                setIsLoggedIn(false)
            }
        });
    }, []) 

    const handlePressLogout = async () => {
        logout()
    }    

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
            <View style={style.innercontainer}>
            <Pressable style={style.buttonStyle} onPress={handlePressLogout}>
                <MaterialIcons name="logout" size={24} color="black" />
            </Pressable>            
                <Text style={style.h2text}>My Profile</Text>            
            <Text style={style.infoText}>Account: {email}</Text>
            <Text style={style.infoText}>Nickname: {nickname}</Text>

            <Button 
            title="Account settings"
            onPress={openAccountSettingsModal}
            />
        </View>
        <AccountSettingsModal 
        visible={isVisible} 
        onClose={closeAccountSettingsModal}
        nickname={nickname}
        setNickname={setNickname}
         />
        </View>
    )
}
}

const AccountSettingsModal = (
    {visible, onClose, nickname, setNickname}) => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmDelete, setConfirmDelete] = useState('')

    const updateUserData = async () => {
        const colRef = collection(db, USERS_REF)
        await updateDoc(doc(colRef, auth.currentUser.uid), {
            nickname: nickname
        })
        .then(() => {
            Alert.alert('Account successfully updated.')
            console.log('Account successfully updated.')
        })
        .catch((error) => {
            console.log('Error updating account:', error)
            Alert.alert('Error updating account:', error)
        })
    }

    const handlePressChangePw = async () => {
        if (!password) {
            Alert.alert('Password cannot be empty.')
        } else if (!confirmPassword) {
            setPassword('')
            Alert.alert('Confirming password cannot be empty.')
        } else if (password !== confirmPassword) {
            Alert.alert('Passwords do not match.')
        } else {
            setPassword('')
            setConfirmPassword('')
            changePassword(password, navigation)
            Alert.alert('Password successfully changed.')
        }
    }

    const handlePressDelete = async () => {
        if (confirmDelete !== 'DELETE') {
            Alert.alert('Please type DELETE to confirm.')
        } else {
            removeUser()
            setConfirmDelete('')
        }
    }

    return (
        <Portal>
            <Modal
                visible={visible} 
                onDismiss={onClose} 
                contentContainerStyle={style.addNewtodoModal} >            
                <View>
                    <Text style={style.h2text}>Account settings</Text>
                    <Text style={style.infoText}>Update account</Text>
                    <Text style={style.infoText}>Nickname: {nickname}</Text>
                    <TextInput
                    value={nickname}
                    style={style.textInput}
                    onChangeText={setNickname}
                    />
                    <View style={style.buttonStyle}>
                        <Button 
                        title="Update account" 
                        onPress={() => updateUserData()} />
                    </View>
                    <Text style={style.infoText}>Change password</Text>   
                    <TextInput
                    value={password}
                    style={style.textInput}
                    placeholder="Enter new password"
                    onChangeText={(password) => setPassword(password)}
                    secureTextEntry={true}
                    />
                    <TextInput
                    value={confirmPassword}
                    style={style.textInput}
                    placeholder="Confirm new password"
                    onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                    secureTextEntry={true}
                    />
                    <View style={style.buttonStyle}>
                        <Button 
                        title="Change password" 
                        onPress={handlePressChangePw} /> 
                    </View>
                    <Text style={style.infoText}>Delete account</Text>
                    <TextInput
                    value={confirmDelete}
                    style={style.textInput}
                    placeholder="Type DELETE to confirm"
                    onChangeText={(confirmDelete) => setConfirmDelete(confirmDelete)}
                    autoCapitalize="characters"
                    />
                    <View style={style.buttonStyle}>
                        <Button 
                        title="Delete account" 
                        color="red"
                        onPress={() => handlePressDelete()} />
                        <Text style={style.infoText}>Warning: Your data will be removed from the database.</Text>
                    </View>
                </View>
            </Modal>
        </Portal>
    )
}