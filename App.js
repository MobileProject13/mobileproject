import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Navigation from './components/Navigation';
import { MyTheme, LightTheme } from './styles/Styles';
import { ToggleThemesContext, BGImageContext } from './components/Context';
import React, { useState, useEffect } from 'react';
import { defaultBGImgDark, defaultBGImgLight } from './components/DataArrays';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase/Config';

export default function App() {

  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [theme, setTheme] = useState(isDarkTheme ? MyTheme : LightTheme);
  const [selectedBGImg, setSelectedBGImg] = useState(isDarkTheme ? defaultBGImgDark : defaultBGImgLight);

 const userIdforAvatar = auth.currentUser ? auth.currentUser.uid : null;
  console.log('userIdforAvatar:', userIdforAvatar);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    setTheme(isDarkTheme ? LightTheme : MyTheme);
    setSelectedBGImg(isDarkTheme ? defaultBGImgLight : defaultBGImgDark);
  };


  useEffect(() => {
    const fetchThemeAndBackgroundImage = async (userId) => {
      try {
        const storedTheme = await AsyncStorage.getItem('@theme' + userId);
        if (storedTheme !== null) {
          const isDark = storedTheme === 'dark';
          setIsDarkTheme(isDark);
          setTheme(isDark ? MyTheme : LightTheme);
          setSelectedBGImg(isDark ? defaultBGImgDark : defaultBGImgLight);
        }
  
        const selectedBgImage = await AsyncStorage.getItem('@selected_bg_image' + userId);
        if (selectedBgImage !== null) {
          setSelectedBGImg(JSON.parse(selectedBgImage));
        }
      } catch (error) {
        console.log('Error getting theme or background image:', error);
      }
    };
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchThemeAndBackgroundImage(user.uid);
      }
    });
  
    return unsubscribe;
  }, []);

  // useEffect(() => {
  //   const getSelectedBackgroundImage = async (userId) => {
  //     try {
  //       const selectedBgImage = await AsyncStorage.getItem('@selected_bg_image' + userId);
  //       if (selectedBgImage !== null) {
  //         setSelectedBGImg(JSON.parse(selectedBgImage));
  //       }
  //     } catch (error) {
  //       console.log('Error getting selected background image:', error);
  //     }
  //   };
  
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       getSelectedBackgroundImage(user.uid);
  //     }
  //   });
  
  //   return unsubscribe;
  // }, []);

  return (
    <SafeAreaProvider>
      <ToggleThemesContext.Provider value={{ theme, toggleTheme }}>
        <BGImageContext.Provider value={{ selectedBGImg, setSelectedBGImg }}>
      <PaperProvider theme={theme}>
        <Navigation/>
      </PaperProvider>
        </BGImageContext.Provider>
      </ToggleThemesContext.Provider>
    </SafeAreaProvider>
  );
};
