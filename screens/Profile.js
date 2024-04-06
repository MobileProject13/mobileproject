import React, { useState, useEffect } from "react"
import { Button, Text, View, Pressable, Alert, TextInput } from "react-native"
import { onAuthStateChanged } from "firebase/auth"
import { logout, changePassword, removeUser } from "../components/Auth"
import styles from "../styles/Styles"
import { MaterialIcons } from '@expo/vector-icons'
import { auth, db, USERS_REF } from "../firebase/Config"
import { collection, doc, getDoc, updateDoc } from "firebase/firestore"

export default function Profile({navigation}) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [email, setEmail] = useState('')    
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [confirmDelete, setConfirmDelete] = useState('')

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

    const handlePressLogout = async () => {
        logout()
    }    

    if (!isLoggedIn) {
        return(
            <View style={styles.container}>
                <View style={styles.headerItem}>
                <Text style={styles.header}>Loading..</Text>
                </View>
            </View>                
        )
    } else {
    return (
        <View style={styles.container}>
            <View style={styles.headerItem}>
                <Text style={styles.header}>My Profile</Text>
            </View>
            <Text style={styles.infoText}>Account: {email}</Text>
            <Pressable style={styles.buttonStyle} onPress={handlePressLogout}>
                <MaterialIcons name="logout" size={24} color="black" />
            </Pressable>
            <Text style={styles.myAccountSubheader}>Update account</Text>
            <Text style={styles.infoText}>Nickname</Text>
            <TextInput
            value={nickname}
            style={styles.textInput}
            onChangeText={setNickname}
            />
            <View style={styles.buttonStyle}>
                <Button 
                title="Update account" 
                onPress={() => updateUserData()} />
            </View>
            <Text style={styles.myAccountSubheader}>Change password</Text>   
            <TextInput
            value={password}
            style={styles.textInput}
            placeholder="Enter new password"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
            />
            <TextInput
            value={confirmPassword}
            style={styles.textInput}
            placeholder="Confirm new password"
            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            secureTextEntry={true}
            />
            <View style={styles.buttonStyle}>
                <Button 
                title="Change password" 
                onPress={handlePressChangePw} /> 
            </View>
            <Text style={styles.myAccountSubheader}>Delete account</Text>
            <TextInput
            value={confirmDelete}
            style={styles.textInput}
            placeholder="Type DELETE to confirm"
            onChangeText={(confirmDelete) => setConfirmDelete(confirmDelete)}
            autoCapitalize="characters"
            />
            <View style={styles.buttonStyle}>
                <Button 
                title="Delete account" 
                color="red"
                onPress={() => handlePressDelete()} />
                <Text style={styles.infoText}>Warning: Your data will be removed from the database.</Text>
            </View>
        </View>
    )
}
}