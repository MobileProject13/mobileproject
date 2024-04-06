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


const Tab = createMaterialTopTabNavigator()
const Stack = createStackNavigator();

export default function Navigation() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setIsLoggedIn(true)
            console.log("User is signed in in navigation");                        
        }
        else {
            setIsLoggedIn(false)
            console.log("User is not signed in in navigation");
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
    tabBarActiveTintColor: 'blue',
    tabBarInactiveTintColor: 'green',
    tabBarPressColor: 'blue'
    }}>
      <Tab.Screen name="Todo" component={Todo} />
      <Tab.Screen name="Budget" component={Budget} />
      <Tab.Screen name="Calendar" component={Calendar} />
    </Tab.Navigator>
  )
}