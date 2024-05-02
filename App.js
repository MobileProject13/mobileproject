import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import Navigation from "./components/Navigation";
import { MyTheme, LightTheme } from "./styles/Styles";
import { ToggleThemesContext, BGImageContext } from "./components/Context";
import React, { useState, useEffect } from "react";
import { bgImages } from "./components/DataArrays";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./firebase/Config";

export default function App() {
	const [isDarkTheme, setIsDarkTheme] = useState(true);
	const [theme, setTheme] = useState(MyTheme);
	const [selectedBGImg, setSelectedBGImg] = useState(bgImages[5]);
	const [userIdforAvatar, setUserIdforAvatar] = useState(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUserIdforAvatar(user.uid);
				console.log("userIdforAvatar in app.js:", userIdforAvatar, user.uid);
			}
		});
		return unsubscribe;
	}, []);

	useEffect(() => {
		const fetchThemeAndBackgroundImage = async () => {
			if (userIdforAvatar) {
				try {
					const storedTheme = await AsyncStorage.getItem("@theme" + userIdforAvatar);
					console.log("app.js storedTheme:", storedTheme);
					if (storedTheme !== null) {
						const isDark = JSON.parse(storedTheme);
						setIsDarkTheme(isDark);
						setTheme(isDark ? MyTheme : LightTheme);
					}

					const selectedBgImage = await AsyncStorage.getItem("@selected_bg_image" + userIdforAvatar);
					if (selectedBgImage !== null) {
						setSelectedBGImg(JSON.parse(selectedBgImage));
					}
				} catch (error) {
					console.log("Error getting theme or background image:", error);
				}
			}
		};
		fetchThemeAndBackgroundImage();
	}, [userIdforAvatar]);

	const toggleTheme = async () => {
		setIsDarkTheme(!isDarkTheme);
		setTheme(isDarkTheme ? LightTheme : MyTheme);
		setSelectedBGImg(isDarkTheme ? bgImages[6] : bgImages[5]);
		const selectedBgImage = await AsyncStorage.getItem("@selected_bg_image" + userIdforAvatar);
		if (selectedBgImage !== null) {
			setSelectedBGImg(JSON.parse(selectedBgImage));
		}
	};

	return (
		<SafeAreaProvider>
			<ToggleThemesContext.Provider value={{ theme, toggleTheme }}>
				<BGImageContext.Provider value={{ selectedBGImg, setSelectedBGImg }}>
					<PaperProvider theme={theme}>
						<Navigation />
					</PaperProvider>
				</BGImageContext.Provider>
			</ToggleThemesContext.Provider>
		</SafeAreaProvider>
	);
}
