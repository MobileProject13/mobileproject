import { StatusBar, StyleSheet } from "react-native";


export default Styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight + 5,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20,
    }
})