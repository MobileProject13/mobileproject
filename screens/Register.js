import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/Config"
import { useEffect, useState } from "react"
import { logout, signUp } from "../components/Auth"
import { Alert, Pressable, ScrollView } from "react-native"
import { Text, View, } from "react-native"
import { Button, TextInput, Icon } from "react-native-paper"
import style from "../styles/Styles"
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradientBG } from "../components/LinearGradientBG"


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

            return(
                <View style={style.container}>
                    <LinearGradientBG/>
                    <ScrollView >
                    <View style={style.innercontainer}>
                    <Text style={[style.headerText, style.marginbottom, {marginTop:40}]}>Register</Text>
                    <Text style={style.infoText}>Create an account</Text>

                        <TextInput
                            mode="outlined"
                            style={[style.textInput, style.marginbottomsmall]}
                            label="Enter your nickname"                                                   
                            right={<TextInput.Icon icon={() => <MaterialIcons name="edit" size={24} color='#D5F67F' />} />}                            value={email}
                            selectionColor='#F1F3F4'
                            activeOutlineColor='#D5F67F'
                            onChangeText={(nickname) => setNickname(nickname.trim())}
                        />                     
                
                        {/* <Text style={style.infoText}>Email</Text> */}

                        <TextInput
                            mode="outlined"
                            style={[style.textInput, style.marginbottomsmall]}
                            label="Enter your email"                                                     
                            right={<TextInput.Icon icon={() => <MaterialIcons name="email" size={24} color='#D5F67F' />} />}                            value={email}
                            selectionColor='#F1F3F4'
                            activeOutlineColor='#D5F67F'
                            onChangeText={(email) => setEmail(email.trim())}
                        />                   
                    
                        {/* <Text style={style.infoText}>Password</Text> */}

                         <TextInput
                            mode="outlined"
                            style={[style.textInput, style.marginbottomsmall]}
                            label="Enter your password"
                            right={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={24} color='#D5F67F' />} />}
                            value={password}
                            selectionColor='#F1F3F4'
                            activeOutlineColor='#D5F67F'
                            onChangeText={(password) => setPassword(password)}
                            secureTextEntry={true}                            
                        />                    
                    
                        {/* <Text style={style.infoText}>Confirm Password</Text> */}

                        <TextInput
                            mode="outlined"
                            style={[style.textInput, style.marginbottomsmall]}
                            label="Confirm your password"
                            right={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={24} color='#D5F67F' />} />}
                            value={confirmPassword}
                            selectionColor='#F1F3F4'
                            activeOutlineColor='#D5F67F'
                            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                            secureTextEntry={true}                            
                        />
                    
                    <Button
                        icon='account-plus'
                        textColor= '#F1F3F4'
                        style={style.buttonsWide}
                        mode='contained'
                        onPress={handlePressRegister}
                        >
                        REGISTER
                    </Button>
                    <Text style={style.infoText}>Already have an account?</Text>
                    <Button
                        icon='login'
                        textColor= '#F1F3F4'
                        style={style.buttonsWide}
                        mode='contained'
                        onPress={() => navigation.navigate('Login')}
                        >
                        LOGIN
                    </Button>
                </View>
                </ScrollView>
            </View>
            )
        }