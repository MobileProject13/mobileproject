import {
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateEmail,
    updatePassword,
    deleteUser,
    sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db, USERS_REF, TODOS_REF } from '../firebase/Config';
import {  doc, setDoc, collection, deleteDoc, onSnapshot, querySnapshot } from 'firebase/firestore';
import { Alert } from 'react-native';

let todosUnsubscribe

const setupTodoListener = () => {
    const subColRef = collection(db, USERS_REF, auth.currentUser.uid, TODOS_REF)
    todosUnsubscribe = onSnapshot(subColRef, (querySnapshot) => {

    })
}

const clearTodoListener = () => {
    if(todosUnsubscribe){
        todosUnsubscribe()
        todosUnsubscribe = null
    }
}

export const signUp = async (email, password, nickname) => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        setDoc(doc(db, USERS_REF, userCredential.user.uid), {
            email: userCredential.user.email,
            nickname: nickname
        })
        console.log("registration succesful.");
        })
        .catch((error) => {
            console.log("Registration failed.", error.message);
            Alert.alert("Registration failed.", error.message);
        }
    );
}

export const logout = async () => {
    clearTodoListener()
    await signOut(auth)
    .then(() => {
        console.log("Logout successful.");
    })
    .catch((error) => {
        console.log("Logout failed.", error.message);
        Alert.alert("Logout failed.", error.message);
    });
}

export const login = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        console.log("Login successful.");
    })
    .catch((error) => {
        console.log("Login failed.", error.message);
        Alert.alert("Login failed.", error.message);
    });
}

export const updateEmailAddress = async (email) => {
        await updateEmail(auth.currentUser, email)
        .then(() => {
            console.log("Email address was updated.");
        })
        .catch((error) => {
            console.log("Email address update failed.", error.message);
            Alert.alert("Email address update failed.", error.message);
        });
    }

export const changePassword = async (password) => {
    await updatePassword(auth.currentUser, password)
    .then(() => {
        console.log("Password was updated.");
        Alert.alert("Password was updated.");
    })
    .catch((error) => {
        console.log("Password update failed.", error.message);
        Alert.alert("Password update failed.", error.message);
    });
}

export const resetPassword = async (email) => {
    auth.languageCode = 'fi';
    await sendPasswordResetEmail(auth, email)
    .then(() => {
        console.log("Password reset email sent.");
        Alert.alert("Password reset email sent.");
    }).catch((error) => {
        console.log("Error sending password reset email:", error.message);
        Alert.alert("Error sending password reset email:", error.message);
    });
}

const removeTodo = async (id) => {
    try {
        const subColRef = collection(db, USERS_REF, auth.currentUser.uid, TODOS_REF)
        await deleteDoc(doc(subColRef, id))
        console.log("Todo deleted.");
    }
    catch (error) {
        console.log("Error deleting todos:", error)
        Alert.alert("Error deleting todos:", error)
    }
}

const deleteTodoDocuments = async () => {
    if(todosUnsubscribe) {
        todosUnsubscribe()
    }
    const subColRef = collection(db, USERS_REF, auth.currentUser.uid, TODOS_REF)
    todosUnsubscribe = onSnapshot(subColRef, (querySnapshot) => {
        const batch = db.batch()
        querySnapshot.docs.forEach((doc) => {
            batch.delete(doc.ref)
        })
        batch.commit().then(() => {
            console.log("Todos deleted succesfully");
        }).catch((error) => {
            console.log("Error deleting todos:", error);
            Alert.alert("Error deleting todos", error.message)
        })
    })  
}

const deleteUserDocument = async () => {
    await deleteDoc(doc(db, USERS_REF, auth.currentUser.uid))
    .then(() => {
        console.log("User document deleted.");
    }).catch((error) => {
        console.log("Error deleting user document:", error)
        Alert.alert("Error deleting user document:", error)
    })
}

export const removeUser = async () => {
    deleteTodoDocuments();
    deleteUserDocument();
    deleteUser(auth.currentUser)
    .then(() => {
        console.log("User deleted.");
    }).catch((error) => {
        console.log("Error deleting user:", error)
        Alert.alert("Error deleting user:", error)
    })
}