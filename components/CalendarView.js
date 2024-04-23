import { Calendar, CalendarList, Agenda, } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { USERS_REF, TODOS_REF, db } from '../firebase/Config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { View, Text } from 'react-native';
import Styles from '../styles/Styles';
import { useEffect, useState, useCallback } from 'react';
import dayjs from 'dayjs';



const CalendarView = () => {

    const [items, setItems] = useState({})
    const [loading, setLoading] = useState(true)
    const auth = getAuth()

    const generateEmptyDates = (year, month) => {
        const startDate = dayjs(`${year}-${month}-01`)
        const endDate = startDate.endOf('month');
        const emptyData = {};

        let currentDate = startDate;
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            const dateKey = currentDate.format('YYYY-MM-DD');
            emptyData[dateKey] = []; // Alusta jokainen päivä tyhjällä taulukolla
            currentDate = currentDate.add(1, 'day');
        }
        return emptyData;
    };


    const fetchTodos = async (userId) => {
        console.log("Fetching todos for userId", userId);
        const todosRef = collection(db, USERS_REF, userId, TODOS_REF)
        const q = query(todosRef, where("done", "==", false))
        try {
            const querySnapshot = await getDocs(q)
            const formattedData = {}
            if (querySnapshot.empty) {
                console.log("No todos found:", data); 
                return {}
            }


            querySnapshot.forEach((doc) => {
                const {todoItem, themeColor, done, todoDate} = doc.data()
                const dateKey = todoDate.dateString

                console.log("Processing todo: ", doc.id, doc.data());
                // const formattedDate = todoDate || "no-date"
                if (!formattedData[dateKey]) {
                    formattedData[dateKey] = []
                }

                formattedData[dateKey].push({
                    name: todoItem,
                    color: themeColor,
                    done: done,
                    height: 80
                })
            })

            Object.keys(formattedData).forEach(key => {
                if (formattedData[key].length === 0) {
                    delete formattedData[key];
                }
            })

            
            console.log("Formatted data: ", formattedData);
            return formattedData
        } catch(error) {
            console.log("Error fetching todos: ", error);
            throw error
        }
}

    useFocusEffect(
        useCallback(() => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                console.log("Focus effect, user UID:", currentUser.uid);
                fetchTodos(currentUser.uid)
                    .then(data => {
                        setItems(data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error("Failed to fetch todos on focus:", error);
                        setLoading(false);
                    });
            }
        }, [auth.currentUser])
    );


        useEffect(() => {

            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    console.log("User is logged in, UID: ", user.uid);
                    fetchTodos(user.uid)
                        .then(data => {
                            console.log("Fetched todos:", data); // Log fetched todos data
                            setItems(data)
                            setLoading(false)
                        })
                        .catch(error => {
                            console.log("Failed to fetch todos", error);
                            setLoading(false)
                        })
                } else {
                    console.log("User is not logged in");
                    setLoading(false)
                }
            })

            return () => unsubscribe()
        }, [])

        if (loading) return <Text>Loading...</Text>


    

    return (
        <View style={Styles.container}>
            <Agenda
                items={items}
                renderItem={(item, firstItemInDay) => {
                  return (
                    <View style={[Styles.item, {height: item.height, backgroundColor: item.color}]}>
                      <Text>{item.name} - {item.done ? 'Done' : 'Pending'}</Text>
                    </View>
                  );
                }}
                renderEmptyDate={() => <View style={Styles.emptyDate}>
                    <Text>No tasks for today.</Text>
                    </View>
                }
            pastScrollRange={12}
            futureScrollRange={12}
            
            />
        </View>
    )
}

export default CalendarView