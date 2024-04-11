import { StatusBar, StyleSheet } from "react-native";
import { MD3DarkTheme } from 'react-native-paper';

const darkblue = '#052939'
const myblue = '#80D4F5'
const pink = '#F67FD4'
const green = '#D5F67F'
const lightcolor = '#F1F3F4'

export default Styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight + 5,
        //backgroundColor: darkblue
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
      borderColor: myblue,
      borderWidth: 2,
      marginTop: 10,
      marginBottom: 10,
    },
    headerText: {
      fontSize: 50,
      color: lightcolor,
      fontWeight: 'bold'
    },
    infoText: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 15,
      color: lightcolor,
    },
    marginbottom: {
      marginBottom: 40
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20,
    },
    todosContainer: {
        flexShrink: 1,
        marginTop: 15,
        marginBottom: 5
      },
      header: {
        marginTop: 40,
        fontSize: 30
      },
      subheader: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: 'bold'
      },
      newItem: {
        marginVertical: 10,
        alignItems: 'flex-start',
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#afafaf',
        width: '90%',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginVertical: 15,
        fontSize: 18
      },
      todoItem: {
        flexDirection: 'row',
        marginVertical: 10
      },
      todoText: {
        fontSize: 18,
        paddingLeft: 10,
        color: 'black'
      },
      logoutIcon: {
        position: 'absolute',
        right: 10,
        top: 10
      },
      headerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      myAccountSubheader: {
        marginTop: 20,
        fontSize: 20
      },
})





export const MyTheme = {
  ...MD3DarkTheme,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: darkblue, //btn txt,icon color
    secondaryContainer: pink, //bottomnav active bg, chips bg flat mode, segmentedbtns bg
    onSecondaryContainer: pink, //selected segmenbtn txt+icon
    background: darkblue, //app bg color
    surface: pink, //chips bg outlined mode
    onSurface: pink, // icon colors, inputText txt color, txt color
    onSurfaceVariant: pink, //inputtxt label, inactive icons, chips txt, inactive radiobutton
    outline: pink, //outlines inputtxt, segmentexbtns, chips   
  }
} 