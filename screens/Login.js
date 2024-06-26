import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../firebase/Config"
import { useEffect, useState } from "react"
import { login, resetPassword } from "../components/Auth"
import { Alert, Pressable } from "react-native"
import { View } from "react-native"
import { Button, TextInput, Text} from "react-native-paper"
import style from "../styles/Styles"
import { MaterialIcons } from '@expo/vector-icons'
import { LinearGradientBG } from "../components/LinearGradientBG"
import { green, lightcolor } from "../components/Colors";

export default function Register({ navigation }) {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showForgotPw, setShowForgotPw] = useState(false)
    const [emailForgotPw, setEmailForgotPw] = useState('')

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

    const handlePressLogin = () => {
        if (!email) {
            Alert.alert('Please enter an email')
        } else if (!password) {
            Alert.alert('Please enter a password')
        } else {
            login(email, password)
            onAuthStateChanged(auth, async (user) => {
                if (user) {                    
                    setEmail('')
                    setPassword('')
                }
            })
        }
    }

    const handlePressResetPw = () => {
        if (!emailForgotPw) {
            Alert.alert('Please enter an email')
        } else {
            resetPassword(emailForgotPw)            
            setShowForgotPw(false)
        }
    }

    const handlePressForgotPw = () => {
        setShowForgotPw(!showForgotPw)
    }

            return(
                <View style={style.container}>
                <LinearGradientBG/>
                    <View style={style.innercontainer}>
                    <Text style={[style.headerText, style.marginbottom]}>Login</Text>
                        <TextInput
                            mode="outlined"
                            style={[style.textInput, style.marginbottomsmall]}
                            label="Enter your email"                                                                                 
                            right={<TextInput.Icon icon={() => <MaterialIcons name="email" size={24} color={green} />} />}
                            value={email}
                            selectionColor={lightcolor}
                            activeOutlineColor={green}
                            onChangeText={(email) => setEmail(email.trim())}
                        />
                        <TextInput
                            mode="outlined"
                            style={[style.textInput, style.marginbottomsmall]}
                            label="Enter your password"
                            right={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={24} color={green} />} />}
                            value={password}
                            selectionColor={lightcolor}
                            activeOutlineColor={green}
                            onChangeText={(password) => setPassword(password)}
                            secureTextEntry={true}                            
                        />
                    
                    <Button
                    icon='login'
                    style={style.buttonsWide}
                    mode='contained'
                    onPress={handlePressLogin}
                    >
                    LOGIN                    
                    </Button> 
                    <Text style={style.infoText}>Not having account yet?</Text>
                    <Button
                    icon='account-plus'
                    style={style.buttonsWide}
                    mode='contained'
                    onPress={() => navigation.navigate('Register')}
                    >
                    REGISTER
                    </Button> 
                    <Pressable style={style.buttonStyle} onPress={handlePressForgotPw}>
                        <Text style={style.infoText}>Forgot password?</Text>
                    </Pressable>
                    {showForgotPw && 
                    <>
                    <TextInput
                        style={style.textInput}
                        placeholder="Enter your email"
                        value={emailForgotPw}
                        onChangeText={(emailForgotPw) => setEmailForgotPw(emailForgotPw)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Pressable style={style.buttonStyle} onPress={()=>handlePressResetPw()}>
                        <Text style={style.infoText}>Reset password. Check you spam folder too after resetting.</Text>
                    </Pressable>
                    </>
                    }
                </View>
                </View>
            )
        }