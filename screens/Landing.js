import React from 'react';
import { View } from 'react-native';
import style from '../styles/Styles';
import { Button, Text, IconButton } from "react-native-paper"
import { blue } from "../components/Colors";
import { LinearGradientBG } from '../components/LinearGradientBG';

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
          style={style.buttonsWide}
          mode='contained'
          onPress={() => navigation.navigate('Login')}
          >
          LOGIN
          </Button>
          <Text style={style.infoText}>Don´t have an account?</Text>
          <Button
          icon='account-plus'
          style={style.buttonsWide}
          mode='contained'
          onPress={() => navigation.navigate('Register')}
          >
          REGISTER
          </Button>
          <IconButton
                icon='information-outline'
                iconColor ={blue}
                size={36}
                onPress={() => navigation.navigate('OnboardingWelcome')}
            />       
          </View>
        </View>
      )
}