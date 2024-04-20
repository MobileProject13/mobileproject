import React from 'react';
import { View, Text } from 'react-native';
import style from '../styles/Styles';
import { Button } from "react-native-paper"
import { LinearGradientBG } from '../components/LinearGradientBG';
import { lightcolor } from "../components/Colors";

export default function Landing ({ navigation }) {  

      return (
        <View style={style.container}>
        <LinearGradientBG/>
          <View style={style.innercontainer}>
          <Text style={style.headerText}>Welcome to</Text>
          <Text style={[style.headerText, style.marginbottom]}>TOBU!</Text>
          <Text style={style.infoText}>
            Login please.
          </Text>    
          <Button
          icon='login'
          textColor= {lightcolor}
          style={style.buttonsWide}
          mode='contained'
          onPress={() => navigation.navigate('Login')}
          >
          LOGIN
          </Button>
          <Text style={style.infoText}>Don´t have an account?</Text>
          <Button
          icon='account-plus'
          textColor= {lightcolor}
          style={style.buttonsWide}
          mode='contained'
          onPress={() => navigation.navigate('Register')}
          >
          REGISTER
          </Button>        
          </View>
        </View>
      )
}