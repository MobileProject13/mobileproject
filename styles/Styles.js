import { StatusBar, StyleSheet } from "react-native";
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { darkblue, blue, pink, green, lightcolor, darkblueWithOpacity } from "../components/Colors";

// const darkblue = '#052939'
// const blue = '#80D4F5'
// const pink = '#F67FD4'
// const green = '#D5F67F'
// const lightcolor = '#F1F3F4'

export default Styles = StyleSheet.create({
    container: {
        flex: 1,
       // marginTop: StatusBar.currentHeight + 5,
        justifyContent: 'space-between',
        backgroundColor: darkblue,
    },
    gradientbackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    innercontainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonsWide: {
      width: '80%',
      borderColor: blue,
      borderWidth: 2,
      marginTop: 10,
      marginBottom: 10,
    },
    buttonMedium: {
      width: '50%',
      borderColor: blue,
      borderWidth: 2,
      marginTop: 10,
      marginBottom: 10,
    },
    buttonSmall: {
      width: '40%',
      borderColor: blue,
      borderWidth: 2,
      marginTop: 10,
      marginBottom: 10,
    },
    headerText: {
      fontSize: 50,
      color: lightcolor,
      fontWeight: 'bold'
    },
    h2text: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 20,
      marginBottom: 20
    },
    infoText: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 15,
    },
    marginbottom: {
      marginBottom: 40
    },
    marginbottomsmall: {
      marginBottom: 20
    },
    viewbottom: {
      marginBottom: 80
    },
    textInput: {
      width: '80%',
      paddingVertical: 8,
    },
    addNewIcon: {
      position: 'absolute', 
      bottom: 0, 
      marginBottom: 5, 
      alignSelf: 'start'
    },
    addNewtodoModal: {      
      backgroundColor:darkblueWithOpacity,
      borderColor: blue,
      borderWidth: 1,
      borderRadius: 10,
      width: '90%',
      alignSelf: 'center',
      padding: 20,      
    },
    chooseColorModal: {
      backgroundColor: darkblue,
      borderColor: blue,
      borderWidth: 1,
      padding: 20,
      borderRadius: 10,
      alignSelf: 'center'
    },
    chooseColorRadiobuttonscolumn: {
      flexDirection: 'column', 
      justifyContent: 'space-between'
    },
    chooseColorRadiobuttonsrow: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    },
    chooseColorRadiobuttonsrowText: {
      fontSize: 16,
      width: 50
    },
    accountSettingModalScroll: {
      height: '80%'      
    },
    accountSettingScrollcontainerstyle: {
      flexGrow: 1,
      justifyContent: 'center', 
      alignItems: 'center'
    },
    todosContainer: {
        flexShrink: 1,
        marginTop: 15,
        marginBottom: 5,
        width: '90%',
        alignSelf: 'center',
    },
    newItem: {
        marginVertical: 10,
        alignItems: 'flex-start',
    },
    todoItem: {
      flexDirection: 'row',
      marginVertical: 5,
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,      
      justifyContent: 'space-between',
      alignItems: 'center',        
    },
    todoItemText: {
      fontSize: 16,
      width: '80%'
    },
    profiletopbar:{
      marginHorizontal: 10,
      marginTop: 16, 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center'
    },
    logoutIcon: {
        position: 'absolute',
        right: 10,
        top: 10
    },
    headerItem: {
      marginHorizontal: 10,
      marginTop: 16, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center'
    },
    profileIconPosition: {
        position: 'absolute',
        right: 10,
    },
    segmentedButtons: {
      width: '90%', 
      alignSelf: 'center', 
      marginTop: 15, 
      marginBottom: 10
    },
    myAccountSubheader: {
        marginTop: 20,
        fontSize: 20
    },
    calendarBox: {
      borderWidth: 1,
      borderColor: 'gray',
      width: '90%',
      marginLeft: 20

    },
    item: {
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 15,
      flex:1,
      paddingTop: 30
    }
})

export const MyTheme = {
  ...MD3DarkTheme,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkblue, //btn txt,icon color
    onPrimary: lightcolor,
    secondaryContainer: darkblue, //bottomnav active bg, chips bg flat mode, segmentedbtns bg
    onSecondaryContainer: lightcolor, //selected segmenbtn txt+icon
    background: darkblue, //app bg color
    surface: pink, //chips bg outlined mode
    onSurface: lightcolor, // icon colors, inputText txt color, txt color
    onSurfaceVariant: lightcolor, //inputtxt label, inactive icons, chips txt, inactive radiobutton
    outline: blue, //outlines inputtxt, segmentexbtns, chips
    text: lightcolor, //txt color
    //backdrop: darkblue, //modal bg   
  }
}

export const LightTheme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: lightcolor, //btn txt,icon color
    onPrimary: darkblue,
    secondaryContainer: lightcolor, //bottomnav active bg, chips bg flat mode, segmentedbtns bg
    onSecondaryContainer: darkblue, //selected segmenbtn txt+icon
    background: lightcolor, //app bg color
    surface: pink, //chips bg outlined mode
    onSurface: darkblue, // icon colors, inputText txt color, txt color
    onSurfaceVariant: darkblue, //inputtxt label, inactive icons, chips txt, inactive radiobutton
    outline: blue, //outlines inputtxt, segmentexbtns, chips
    text: darkblue, //txt color
    //backdrop: darkblue, //modal bg   
  }
}