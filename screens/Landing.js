import React from 'react';
import { View, Text, Button } from 'react-native';
import style from '../styles/Styles';


export default function Landing ({ navigation }) {

      return (
        <View style={style.container}>
          <Text style={style.header}>Welcome to Tobu!</Text>
          <Text style={style.infoText}>
            You are not logged in. Login please.
          </Text>
          <Button
          title='Go to login'
          onPress={() => navigation.navigate('Login')}
          />
          <Text style={style.infoText}>Don´t have an account?</Text>
          <Button
          title='Go to register'
          onPress={() => navigation.navigate('Register')}
          />
        </View>
      )
}