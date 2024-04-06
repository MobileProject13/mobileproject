import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/Config"
import { useEffect, useState } from "react"
import { logout, signUp } from "../components/Auth"
import { Alert, Pressable } from "react-native"
import { Button, Text, View, TextInput } from "react-native"
import styles from "../styles/Styles"
import { MaterialIcons } from '@expo/vector-icons'


export default function Register({ navigation }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true)
            }
            else {
                setIsLoggedIn(false)
            }
        })
    }, []) 

    const handlePressRegister = () => {
        if (!nickname) {
            Alert.alert('Please enter a nickname')
        } else if (!email) {
            Alert.alert('Please enter an email')
        } else if (!password) {
            Alert.alert('Please enter a password')
        } else if (!confirmPassword) {
            setPassword('')
            Alert.alert('Please confirm your password')
        } else if (password !== confirmPassword) {
            Alert.alert('Passwords do not match')
        } else {
            signUp(email, password, nickname)
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setNickname('')
                    setEmail('')
                    setPassword('')
                    setConfirmPassword('')
                   // navigation.navigate('Todos')
                }
            })
        }
    }

        const handlePressLogout = async () => {
            logout()
        }

        // if (isLoggedIn) {
        //     return(
        //         <View style={styles.container}>
        //             <View style={styles.headerItem}>
        //             <Text style={styles.header}>Todos: Register</Text>
        //             <Pressable style={styles.logoutIcon} onPress={handlePressLogout}>
        //                 <MaterialIcons name="logout" size={24} color="black" />
        //             </Pressable>
        //         </View>
        //         <Text style={styles.infoText}>You are already logged in.</Text>
        //         <Button
        //             title='Go to todos'
        //             onPress={() => navigation.navigate('Todos')}
        //         />
        //         <Button
        //             title='Go to my account'
        //             onPress={() => navigation.navigate('MyAccount')}
        //         />
        //     </View>                
        //     )
        // } else {
            return(
                <View style={styles.container}>
                    <Text style={styles.header}>Register</Text>
                    <Text style={styles.infoText}>Create an account</Text>
                    <View style={styles.newItem}>
                        <Text style={styles.infoText}>Nickname</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your nickname"
                            value={nickname}
                            onChangeText={(nickname) => setNickname(nickname.trim())}
                        />
                    </View>
                    <View style={styles.newItem}>
                        <Text style={styles.infoText}>Email</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={(email) => setEmail(email.trim())}
                        />
                    </View>
                    <View style={styles.newItem}>
                        <Text style={styles.infoText}>Password</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={styles.newItem}>
                        <Text style={styles.infoText}>Confirm Password</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                            secureTextEntry={true}
                        />
                    </View>
                    <Button
                        style={styles.buttonStyle}
                        title="Register"
                        onPress={handlePressRegister}
                    />
                    <Text style={styles.infoText}>Already have an account?</Text>
                    <Button
                        style={styles.buttonStyle}
                        title="Login"
                        onPress={() => navigation.navigate('Login')}
                    />
                </View>
            )
        }
// }