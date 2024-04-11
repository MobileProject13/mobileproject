import React from 'react';
import { View, Text } from 'react-native';
import style from '../styles/Styles';
import { Button } from "react-native-paper"
import { LinearGradient } from 'expo-linear-gradient';

export default function Landing ({ navigation }) {  

      return (
        <View style={style.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#052939', '#80D4F5']}
        start={{ x: 0.1, y: 1 }}
        end={{ x: 1, y: 0 }}
        locations={[0.2, 0.9]}
        style={style.gradientbackground}
        />
          <Text style={style.header}>Welcome to Tobu!</Text>
          <Text style={style.infoText}>
            You are not logged in. Login please.
          </Text>    
          <Button
          textColor= '#F1F3F4'
          style={{borderColor: 'blue', borderWidth: 5}}
          mode='contained'
          onPress={() => navigation.navigate('Login')}
          >LOGIN</Button>      

          <Text style={style.infoText}>Don´t have an account?</Text>
          <Button
          textColor= '#F1F3F4'
          style={{borderColor: 'blue', borderWidth: 5}}
          mode='contained'
          onPress={() => navigation.navigate('Login')}
          >REGISTER</Button> 
        </View>
      )
}