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
    },
    todosContainer: {
        flexShrink: 1,
        marginTop: 15,
        marginBottom: 5
      },
      header: {
        marginTop: 40,
        fontSize: 30
      },
      subheader: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: 'bold'
      },
      newItem: {
        marginVertical: 10,
        alignItems: 'flex-start',
      },
      infoText: {
        marginTop: 5,
        marginBottom: 5,
        fontSize: 15
      },
      buttonStyle: {
        width: '90%'
      },
      textInput: {
        borderWidth: 1,
        borderColor: '#afafaf',
        width: '90%',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        marginVertical: 15,
        fontSize: 18
      },
      todoItem: {
        flexDirection: 'row',
        marginVertical: 10
      },
      todoText: {
        fontSize: 18,
        paddingLeft: 10,
        color: 'black'
      },
      logoutIcon: {
        position: 'absolute',
        right: 10,
        top: 10
      },
      headerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      myAccountSubheader: {
        marginTop: 20,
        fontSize: 20
      },
})