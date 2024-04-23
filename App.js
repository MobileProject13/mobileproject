import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Navigation from './components/Navigation';
import { MyTheme, LightTheme } from './styles/Styles';
import { ToggleThemesContext, BGImageContext } from './components/Context';
import React, { useState, useEffect } from 'react';
import { defaultBGImgDark, defaultBGImgLight, bgImages } from './components/DataArrays';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './firebase/Config';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [theme, setTheme] = useState(MyTheme);
  //const [selectedBGImg, setSelectedBGImg] = useState(defaultBGImgDark);
  const [selectedBGImg, setSelectedBGImg] = useState(bgImages[5]);

 const userIdforAvatar = auth.currentUser ? auth.currentUser.uid : null;
  console.log('userIdforAvatar:', userIdforAvatar);

  useEffect(() => {
    const fetchThemeAndBackgroundImage = async (userId) => {
      try {
        const storedTheme = await AsyncStorage.getItem('@theme' + userId);
        if (storedTheme !== null) {
          // const isDark = storedTheme === 'dark';
          setIsDarkTheme(storedTheme);
          setTheme(storedTheme ? MyTheme : LightTheme);
          //setSelectedBGImg(storedTheme ? bgImages[5] : bgImages[6]);
          // if(selectedBGImg === defaultBGImgLight || selectedBGImg === defaultBGImgDark) {
          //   setSelectedBGImg(storedTheme ? defaultBGImgDark : defaultBGImgLight);
          // }
        }
  
    //     const selectedBgImage = await AsyncStorage.getItem('@selected_bg_image' + userId);
    //     if (selectedBgImage !== null) {
    //       setSelectedBGImg(JSON.parse(selectedBgImage));
    //     }
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

  const toggleTheme = async() => {
    setIsDarkTheme(!isDarkTheme);
    setTheme(isDarkTheme ? LightTheme : MyTheme);
    // jos dark tai ligth ei ole valittu niin selectedbgimg
    const selectedBgImage = await AsyncStorage.getItem('@selected_bg_image' + userIdforAvatar);
  if (selectedBgImage !== null) {
    setSelectedBGImg(JSON.parse(selectedBgImage));
  } else {
    setSelectedBGImg(isDarkTheme ? bgImages[6] : bgImages[5]);
  }
  }


  //_________________________________________________________

//   const [isDarkTheme, setIsDarkTheme] = useState(true);
//   const [theme, setTheme] = useState(MyTheme);
//   //const [selectedBGImg, setSelectedBGImg] = useState(defaultBGImgDark);
//   const [selectedBGImg, setSelectedBGImg] = useState(null);

//  const userIdforAvatar = auth.currentUser ? auth.currentUser.uid : null;
//   console.log('userIdforAvatar:', userIdforAvatar);

//   const toggleTheme = async() => {
//     setIsDarkTheme(!isDarkTheme);
//     setTheme(isDarkTheme ? LightTheme : MyTheme);
//     // jos dark tai ligth ei ole valittu niin selectedbgimg
//     setSelectedBGImg(isDarkTheme ? defaultBGImgLight : defaultBGImgDark); 
//     // if(!selectedBGImg === defaultBGImgLight || !selectedBGImg === defaultBGImgDark){
//     // } else{
//     //   setSelectedBGImg(isDarkTheme ? defaultBGImgLight : defaultBGImgDark);
//     // };
//     // console.log('selectedBGImg:', selectedBGImg);
//   }


//   useEffect(() => {
//     const fetchThemeAndBackgroundImage = async (userId) => {
//       try {
//         const storedTheme = await AsyncStorage.getItem('@theme' + userId);
//         if (storedTheme !== null) {
//           // const isDark = storedTheme === 'dark';
//           setIsDarkTheme(storedTheme);
//           setTheme(storedTheme ? MyTheme : LightTheme);
//           setSelectedBGImg(storedTheme ? defaultBGImgDark : defaultBGImgLight);
//           // if(selectedBGImg === defaultBGImgLight || selectedBGImg === defaultBGImgDark) {
//           //   setSelectedBGImg(storedTheme ? defaultBGImgDark : defaultBGImgLight);
//           // }
//         }
  
//         const selectedBgImage = await AsyncStorage.getItem('@selected_bg_image' + userId);
//         if (selectedBgImage !== null) {
//           setSelectedBGImg(JSON.parse(selectedBgImage));
//         }
//       } catch (error) {
//         console.log('Error getting theme or background image:', error);
//       }
//     };
  
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchThemeAndBackgroundImage(user.uid);
//       }
//     });
  
//     return unsubscribe;
//   }, []);

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
