import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { USERS_REF, TODOS_REF, SHAREDTODOS_REF, db, auth } from "../firebase/Config";


export const ShareTodo = async (todoId, nickname) => {
    try {
        const user = auth().currentUser
        if(user) {
            const userId = user.uid
            console.log("Current user ID: ", userId, "Shared todo ID: ", todoId);
        

        const todoRef = doc(db, USERS_REF, userId, TODOS_REF,todoId )

            const todoDoc = await getDoc(todoRef)
            if (todoDoc.exists()) {
                const todoData = todoDoc.data()

                const sharedRef = collection(db, SHAREDTODOS_REF)

                const result = await addDoc(sharedRef, {
                    ...todoData,
                    sharedDate: new Date(),
                    sharedTo: nickname
                    
                })
                console.log("Todo shared succesfully with ID: ", result.id);
            } else {
                console.log("No todo found for todo ID: ", todoId);
            } 
        } else {
            console.log("User not logged in");
        }

    } catch (error) {
        console.log("Error sharing the doto", error);
    } 
}