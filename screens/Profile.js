import React, { useState, useEffect, useContext } from "react"
import { View, Pressable, Alert, ScrollView, FlatList, ImageBackground } from "react-native"
import { onAuthStateChanged } from "firebase/auth"
import { logout, changePassword, removeUser } from "../components/Auth"
import style from "../styles/Styles"
import { MaterialIcons } from '@expo/vector-icons'
import { auth, db, USERS_REF } from "../firebase/Config"
import { collection, doc, getDoc, updateDoc } from "firebase/firestore"
import { TextInput, Modal, Portal, Button, Avatar, IconButton, Switch, Text } from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { avatars, bgImages, defaultBGImgDark, defaultBGImgLight } from "../components/DataArrays"
import { darkblue, green, lightcolor, darkblueWithOpacity, lightcolorWithOpacity } from "../components/Colors";
import { ToggleThemesContext, BGImageContext } from "../components/Context"

export default function Profile({navigation}) {

    const {theme, toggleTheme} = useContext(ToggleThemesContext)
    const {selectedBGImg, setSelectedBGImg} = useContext(BGImageContext)

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [email, setEmail] = useState('')    
    const [nickname, setNickname] = useState('')
    const [isAccountSettingsVisible, setIsAccountSettingsVisible] = useState(false)
    const [isAvatarModalVisible, setIsAvatarModalVisible] = useState(false)
    const [selectedAvatar, setSelectedAvatar] = useState(null)
    const [isBGImgModalVisible, setIsBGImgModalVisible] = useState(false)

    const userIdforAvatar = auth.currentUser ? auth.currentUser.uid : null;
    const isDarkTheme = theme.dark;

    // const onToggleSwitch = () => {
    //     toggleTheme();
    // };

    const onToggleSwitch = async () => {
        toggleTheme();
        const setThemeInStorage = !isDarkTheme;
        try {
          await AsyncStorage.setItem('@theme' + userIdforAvatar, JSON.stringify(setThemeInStorage));
          console.log('profilejs stores theme:',setThemeInStorage);
        } catch (error) {
          console.log('Error saving theme:', error);
        }
      };

    const openBGImgModal = () => setIsBGImgModalVisible(true)
    const closeBGImgModal = () => setIsBGImgModalVisible(false)

    const openAvatarModal = () => setIsAvatarModalVisible(true)
    const closeAvatarModal = () => setIsAvatarModalVisible(false)

    const openAccountSettingsModal = () => setIsAccountSettingsVisible(true)
    const closeAccountSettingsModal = () => setIsAccountSettingsVisible(false)

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

    useEffect(() => {
        const fetchAvatar = async () => {
          try {
            const avatarIndex = await AsyncStorage.getItem('@avatar_index' + userIdforAvatar);
            if (avatarIndex !== null) {
              setSelectedAvatar(avatars[parseInt(avatarIndex, 10)]);
            }
          } catch (error) {
            console.log('Error getting avatar path:', error);
          }
        };    
        fetchAvatar();
      }, []);

    const handlePressLogout = async () => {
        logout()
    } 
    
    const defaultBGImgByTheme = isDarkTheme ? bgImages[5] : bgImages[6]
    const defaultModalBGColor = isDarkTheme ? darkblueWithOpacity : lightcolorWithOpacity
    const materialIconColorByTheme = isDarkTheme ? lightcolor : darkblue

    if (!isLoggedIn) {
        return(
            <View style={style.container}>
                <ImageBackground source={selectedBGImg} style={{flex:1}} >
                <View style={style.innercontainer}>
                <Text style={style.h2text}>Loading..</Text>
                </View>
                </ImageBackground>
            </View>                
        )
    } else {
    return (
        <View style={style.container}>
            <ImageBackground source={selectedBGImg} style={{flex:1}} >
            <View style={style.profiletopbar}>
                <Pressable style={style.buttonStyle} onPress={()=> navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={40} color={materialIconColorByTheme}/>
                </Pressable>
                <Switch 
                value={isDarkTheme} 
                onValueChange={onToggleSwitch}
                style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                 />
                <Pressable style={style.buttonStyle} onPress={handlePressLogout}>
                    <MaterialIcons name="logout" size={40} color={materialIconColorByTheme} />
                </Pressable>                
                </View>   
            <View style={style.innercontainer}>         
                <Text style={style.h2text}>My Profile</Text>
                <Pressable onPress={openAvatarModal}>
                {selectedAvatar === null ?
                    <Avatar.Icon size={200} icon='account' />
                :    
                    <Avatar.Image size={200} source={selectedAvatar} />}
                </Pressable>            
                <Text style={style.infoText}>Account: {email}</Text>
                <Text style={style.infoText}>Nickname: {nickname}</Text>
                <Button
                    icon='image-edit-outline'
                    //textColor= {theme.colors.text}
                    style={style.buttonsWide}
                    mode='contained'
                    onPress={openAvatarModal} 
                > Change Avatar </Button>
                <Button
                    icon='image-edit-outline'
                    //textColor= {lightcolor}
                    style={style.buttonsWide}
                    mode='contained'
                    onPress={openBGImgModal} 
                > Change Background Image </Button>
                <Button
                    icon='account-settings'
                    //textColor= {lightcolor}
                    style={style.buttonsWide}
                    mode='contained' 
                    onPress={openAccountSettingsModal}
                > Account settings </Button>
            </View>
            </ImageBackground>
        <BGImgModal
            visible={isBGImgModalVisible} 
            onClose={closeBGImgModal}
            setSelectedBGImg={setSelectedBGImg}
            bgImages={bgImages}
            modalBGColor={defaultModalBGColor}
            materialIconColor={materialIconColorByTheme}
            defaultBgImgbytheme={defaultBGImgByTheme}
        />
        <ChangeAvatarModal 
            visible={isAvatarModalVisible} 
            onClose={closeAvatarModal}
            setSelectedAvatar={setSelectedAvatar}
            avatars={avatars}
            modalBGColor={defaultModalBGColor}
            materialIconColor={materialIconColorByTheme}
        />
        <AccountSettingsModal 
            visible={isAccountSettingsVisible} 
            onClose={closeAccountSettingsModal}
            nickname={nickname}
            setNickname={setNickname}
            modalBGColor={defaultModalBGColor}
            materialIconColor={materialIconColorByTheme}
         />
        </View>
    )
}
}

const BGImgModal = ({visible, onClose, setSelectedBGImg, bgImages, modalBGColor, materialIconColor, defaultBgImgbytheme}) => {

    const userIdforAvatar = auth.currentUser.uid

    const handleBGImgPress = async (bgImg) => {
        setSelectedBGImg(bgImg)
        try {
            await AsyncStorage.setItem('@selected_bg_image' + userIdforAvatar, JSON.stringify(bgImg));
          } catch (error) {
            console.log('Error saving selected background image:', error);
          }        
        onClose()
    }

    const removeBGImg = async() => {
        
        try {
            await AsyncStorage.removeItem('@selected_bg_image' + userIdforAvatar)
            console.log('Background image removed.');
        } catch (error) {
            console.log('Error removing avatar path:', error)
        }
        setSelectedBGImg(defaultBgImgbytheme)
        onClose()
    }

    return(
        <Portal>
            <Modal
            visible={visible}
            onDismiss={onClose}
            contentContainerStyle={[style.addNewtodoModal, {backgroundColor: modalBGColor, height: '80%'}]}
            >
                <IconButton
                    icon='close'
                    color={materialIconColor}
                    size={24}
                    onPress={onClose}
                />
                <Text style={style.h2text}>Choose Background Image</Text>
                <FlatList
                data={bgImages}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                renderItem={({item}) => (
                    <Pressable
                    style={{margin: 10}} 
                    onPress={() => handleBGImgPress(item)}>
                        <ImageBackground source={item} style={{height: 200, width:150}} />
                    </Pressable>
                )}
                />
                <View style={{alignSelf: 'center', marginVertical: 10}}>
                <Button
                    icon='close'
                    style={style.buttonsWide}
                    mode='contained'
                    onPress={removeBGImg}
                >
                    Remove BackgrounImage
                </Button>
                </View>
            </Modal>
        </Portal>
    )
}

const ChangeAvatarModal = ({visible, onClose, setSelectedAvatar, avatars, modalBGColor}) => {

    useEffect(() => {
        getAvatarPath();
    }, [])

    const getAvatarPath = async () => {
        try {
            const avatarpath = await AsyncStorage.getItem('@avatar_index')
            if(avatarpath !== null) {
                setSelectedAvatar(avatars[parseInt(avatarpath, 10)])
            }
        } catch (error) {
            console.log('Error getting avatar path:', error)
        }
    }

    const userIdforAvatar = auth.currentUser.uid

    const handleAvatarPress = async (avatar) => {
        const index = avatars.indexOf(avatar)
        setSelectedAvatar(avatar)
        try {
            await AsyncStorage.setItem('@avatar_index'+ userIdforAvatar, index.toString())
        } catch (error) {
            console.log('Error setting avatar path:', error)
        }
        onClose()
    }

    const removeAvatar = async() => {
        setSelectedAvatar(null)
        try {
            await AsyncStorage.removeItem('@avatar_index' + userIdforAvatar)
        } catch (error) {
            console.log('Error removing avatar path:', error)
        }
        onClose()
    }

    return(
        <Portal>
            <Modal
            visible={visible}
            onDismiss={onClose}
            contentContainerStyle={[style.addNewtodoModal, {backgroundColor: modalBGColor}]}>
                <IconButton
                        icon='close'
                        size={24}
                        onPress={onClose}
                    />
            <Text style={style.h2text}>Choose Avatar</Text>
                <FlatList
                data={avatars}
                keyExtractor={(item, index) => index.toString()}
                numColumns={4}
                contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
                renderItem={({item}) => (
                    <Pressable
                    style={{margin: 10}} 
                    onPress={() => handleAvatarPress(item)}>
                        <Avatar.Image size={60} source={item} />
                    </Pressable>
                )}
                />
                <View style={{alignSelf: 'center', marginVertical: 10}}>
                <Button
                    icon='close'
                    style={style.buttonsWide}
                    mode='contained'
                    onPress={removeAvatar}
                >
                    Remove Avatar
                </Button>
                </View>
            </Modal>
        </Portal>
    )
}

const AccountSettingsModal = ({visible, onClose, nickname, setNickname, modalBGColor, materialIconColor}) => {

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
                contentContainerStyle={[style.addNewtodoModal, {backgroundColor: modalBGColor}]} >
                <View >
                    <IconButton
                        icon='close'
                        size={24}
                        onPress={onClose}
                    />
                <Text style={style.h2text}>Account settings</Text>               
                <ScrollView
                contentContainerStyle={style.accountSettingScrollcontainerstyle} 
                style={style.accountSettingModalScroll}
                showsVerticalScrollIndicator={true}
                >                    
                    <Text style={style.h2text}>Update account</Text>
                    <Text style={style.infoText}>Nickname: {nickname}</Text>
                    <TextInput
                        mode="outlined"
                        style={[style.textInput, style.marginbottomsmall]}
                        selectionColor={lightcolor}
                        activeOutlineColor={green}
                        label='Enter new Nickname'
                        right={<TextInput.Icon icon={() => <MaterialIcons name="person" size={24} color={materialIconColor} />} />}
                        value={nickname} 
                        onChangeText={setNickname}
                    />                   
                    <Button 
                        icon='account'
                        style={style.buttonsWide}
                        mode='contained'                         
                        onPress={() => updateUserData()}>
                            Update Nickname
                    </Button>                    
                    <Text style={style.infoText}>Change password</Text>   
                    <TextInput
                        mode="outlined"
                        style={[style.textInput, style.marginbottomsmall]}
                        selectionColor={lightcolor}
                        activeOutlineColor={green}
                        value={password}
                        label="Enter new password"
                        right={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={24} color={materialIconColor} />} />}
                        onChangeText={(password) => setPassword(password)}
                        secureTextEntry={true}
                    />
                    <TextInput
                        mode="outlined"
                        style={[style.textInput, style.marginbottomsmall]}
                        selectionColor={lightcolor}
                        activeOutlineColor={green}
                        value={confirmPassword}
                        label="Confirm new password"
                        right={<TextInput.Icon icon={() => <MaterialIcons name="lock" size={24} color={materialIconColor} />} />}
                        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                        secureTextEntry={true}
                    />
                    <View style={style.buttonStyle}>
                        <Button
                        icon='lock'
                        style={style.buttonsWide}
                        mode='contained' 
                        onPress={handlePressChangePw} > 
                        Change password
                        </Button>
                    </View>
                    <Text style={style.infoText}>Delete account</Text>
                    <TextInput
                        mode="outlined"
                        style={[style.textInput, style.marginbottomsmall]}
                        selectionColor={lightcolor}
                        activeOutlineColor={green}
                        value={confirmDelete}
                        label="Type DELETE to confirm"
                        right={<TextInput.Icon icon={() => <MaterialIcons name="close" size={24} color={materialIconColor} />} />}
                        onChangeText={(confirmDelete) => setConfirmDelete(confirmDelete)}
                        autoCapitalize="characters"
                    />                    
                    <Button 
                        icon='account-remove'
                        textColor= 'red'
                        style={style.buttonsWide}
                        mode='contained'
                        onPress={() => handlePressDelete()} >
                        Delete account
                        </Button>
                        <Text style={style.infoText}>Warning: Your data will be removed from the database.</Text>                   
                </ScrollView>
                </View> 
            </Modal>
        </Portal>
    )
}

