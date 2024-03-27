import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Todo from "./Todo";
import Budget from "./Budget";
import Calendar from "./Calendar";

const Tab = createMaterialTopTabNavigator()

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator
            tabBarPosition="bottom"
            screenOptions={{
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'green',
                tabBarPressColor: 'blue'
            }}
            >
                <Tab.Screen
                name="Todo"
                component={Todo}
                />
                <Tab.Screen
                name="Budget"
                component={Budget}
                />
                <Tab.Screen
                name="Calendar"
                component={Calendar}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}