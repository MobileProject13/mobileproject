import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Todo from "../screens/Todo"
import Budget from "../screens/Budget"
import Calendar from "../screens/Calendar"
import Landing from "../screens/Landing"
import Register from "../screens/Register"
import Login from "../screens/Login"
import Profile from "../screens/Profile"
import { useState, useEffect } from "react";
import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/Config";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator();

export default function Navigation() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsLoggedIn(true)                                   
        }
        else {
            setIsLoggedIn(false)            
        }
    })
}, []) 

  return (
    <NavigationContainer>
      <Stack.Navigator> 
      {!isLoggedIn ? (
        <>  
          <Stack.Screen name="Welcome" component={Landing} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        </>  
        ) : (
        <>
          <Stack.Screen name="TabNav" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={Profile}  />
        </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const TabNavigator = () => {
  return (
    <Tab.Navigator
    tabBarPosition="bottom"
    screenOptions={{
    tabBarActiveTintColor: '#F1F3F4',
    tabBarInactiveTintColor: '#80D4F5',
    tabBarPressColor: '#80D4F5',
    tabBarStyle: { backgroundColor: '#052939' },    
    }}>
      <Tab.Screen 
      name="Todo" 
      component={Todo} 
      options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="format-list-bulleted" color={color} size={24} />
          ),
        }}/>
      <Tab.Screen 
      name="Budget" 
      component={Budget} 
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="currency-eur" color={color} size={24} />
        ),
      }}/>
      <Tab.Screen 
      name="Calendar" 
      component={Calendar}
      options={{
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="calendar" color={color} size={24} />
        ),
      }} />
    </Tab.Navigator>
  )
}