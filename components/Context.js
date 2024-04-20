import { createContext } from "react";
import { MyTheme, LightTheme } from "../styles/Styles";

export const ToggleThemesContext = createContext({
    theme: MyTheme,
    toggleTheme: () => {}
});