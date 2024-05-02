import { Modal, Portal, Text, Button, TextInput, RadioButton, Snackbar, List } from "react-native-paper";
import style from "../styles/Styles";
import { View } from "react-native";
import { useState, useContext, useMemo } from "react";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db, auth, USERS_REF, MONEY_REF } from "../firebase/Config";
import { Calendar } from "react-native-calendars";
import { blue, pink, green, lightcolor } from "./Colors";
import { ToggleThemesContext } from "./Context";
import RadioGroup from "react-native-radio-buttons-group";



export const AddNewBudgetModal = ({ isVisible, onClose, todosKeys, todos }) => {
	const { theme } = useContext(ToggleThemesContext);

	const [newTodo, setNewTodo] = useState("");
	const [selectedId, setSelectedId] = useState("");
	const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
	const [date, setDate] = useState();
	const [addNotification, setAddNotification] = useState(false);
	const [notificationText, setNotificationText] = useState("");

	const radioButtons = useMemo(
		() => [
			{
				id: "1",
				label: "Income",
				value: "income",
				borderColor: "#fff",
				color: "#fff",
			},
			{
				id: "2",
				label: "Expense",
				value: "expense",
				borderColor: "#fff",
				color: "#fff",
			},
		],
		[]
	);

	const openCalendarModal = () => setIsCalendarModalVisible(true);
	const closeCalendarModal = (day) => {
		setIsCalendarModalVisible(false);
		setDate(day);
	};

	let datePicked = date ? date?.dateString : "Date";

	const addNewTodo = async () => {
		const IsDateChosen = date ? date : "";

		try {
			if (newTodo == "" || IsDateChosen == "" || selectedId == "") {
				setNotificationText("Please fill all fields");
				setAddNotification(true);
				return;
			}

			const subColRef = collection(db, USERS_REF, auth.currentUser.uid, MONEY_REF);
			const docRef = doc(db, USERS_REF, auth.currentUser.uid);
			const docSnap = await getDoc(docRef);
			const userData = docSnap.data();
			await addDoc(subColRef, {
				amount: newTodo,
				date: IsDateChosen,
				moneyOwner: userData.nickname,
				category: selectedId,
			});
			setNewTodo("");
			setDate();
			setSelectedId("");
			setNotificationText("Money Added successfully!");
			setAddNotification(true);
			onClose();
		} catch (error) {
			console.log(error.message);
		}
	};

	return (
		<Portal>
			<Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={[style.addNewtodoModal, { backgroundColor: theme.colors.background }]}>
				<View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
					<Text style={style.h2text}>Add Income/Expense</Text>
					<View>
						<RadioGroup layout="row" radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} labelStyle={{ color: "white" }} />
					</View>
					<TextInput
						mode="outlined"
						style={[style.textInput, style.marginbottomsmall]}
						selectionColor={lightcolor}
						activeOutlineColor={green}
						label="Amount"
						value={newTodo}
						onChangeText={setNewTodo}
					/>
				</View>

				<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
					<Button icon="calendar-edit" style={date ? style.buttonMedium : style.buttonSmall} mode="contained" onPress={openCalendarModal}>
						{datePicked}
					</Button>
				</View>

				<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
					<Button style={style.buttonSmall} mode="contained" onPress={addNewTodo}>
						Add
					</Button>
					<Button style={style.buttonSmall} mode="contained" onPress={onClose}>
						Done
					</Button>
				</View>
			</Modal>
			<PickDate visible={isCalendarModalVisible} onClose={closeCalendarModal} />
			<Snackbar visible={addNotification} onDismiss={() => setAddNotification(false)} duration={2000}>
				{notificationText}
			</Snackbar>
		</Portal>
	);
};

const PickDate = ({ visible, onClose }) => {
	const { theme } = useContext(ToggleThemesContext);

	return (
		<Modal visible={visible} onDismiss={onClose} contentContainerStyle={[style.chooseColorModal, { backgroundColor: theme.colors.background }]}>
			<Calendar
				firstDay={1}
				theme={{
					calendarBackground: theme.colors.background,
					textSectionTitleColor: theme.colors.text,
					selectedDayBackgroundColor: theme.colors.primary,
					selectedDayTextColor: theme.colors.text,
					todayTextColor: theme.colors.text,
					dayTextColor: theme.colors.text,
					textDisabledColor: blue,
					dotColor: theme.colors.text,
					selectedDotColor: theme.colors.text,
					arrowColor: theme.colors.text,
					monthTextColor: theme.colors.text,
					textDayFontFamily: 'monospace',
              		textMonthFontFamily: 'monospace',
              		textDayHeaderFontFamily: 'monospace',
					textDayFontWeight: "300",
					textMonthFontWeight: "bold",
					textDayHeaderFontWeight: "300",
					textDayFontSize: 16,
					textMonthFontSize: 16,
					textDayHeaderFontSize: 16,
				}}
				onDayPress={onClose}
			/>
		</Modal>
	);
};
