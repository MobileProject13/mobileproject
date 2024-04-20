import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Navigation from './components/Navigation';
import { MyTheme, LightTheme } from './styles/Styles';
import { ToggleThemesContext } from './components/Context';
import React, { useState } from 'react';

export default function App() {

const [theme, setTheme] = useState(MyTheme);
const toggleTheme = () => {
  setTheme(theme === MyTheme ? LightTheme : MyTheme);
}

  return (
    <SafeAreaProvider>
      <ToggleThemesContext.Provider value={{ theme, toggleTheme }}>
      <PaperProvider theme={theme}>
        <Navigation/>
      </PaperProvider>
      </ToggleThemesContext.Provider>
    </SafeAreaProvider>
  );
};
