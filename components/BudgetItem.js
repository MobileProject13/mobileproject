import { Pressable, View } from "react-native";
import style from "../styles/Styles";
import React, { useState, useContext, useEffect } from "react";
import { collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db, MONEY_REF, USERS_REF } from "../firebase/Config";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth } from "../firebase/Config";
import { ToggleThemesContext } from "./Context";
import { Modal, Text } from "react-native-paper";
import { ShareTodoModal } from "./ShareTodoModal";
import dayjs from "dayjs";

export const BudgetItem = ({ amount, category, moneyId, date }) => {
	const [showShareModal, setShowShareModal] = useState(false);

	const onRemove = async () => {
		try {
			console.log("Removing", moneyId);
			const subColRef = collection(db, USERS_REF, auth.currentUser.uid, MONEY_REF);
			const res = await deleteDoc(doc(subColRef, moneyId));
			console.log(res);
		} catch (error) {
			console.error("Error removing document:", error.message);
			// Show error message to the user or handle it accordingly
		}
	};

	const { theme } = useContext(ToggleThemesContext);
	return (
		<View style={[style.budgetItem, { backgroundColor: theme.colors.background }]}>
			<View style={{ flexDirection: "row" }}>
				{category == 1 ? <MaterialIcons name={"add"} size={32} color="green" /> : <MaterialCommunityIcons name={"minus"} size={32} color="red" />}
				<View style={{ marginLeft: 10 }}>
					<Text style={style.budgetItemText}>€{amount}</Text>
					<Text style={style.budgetItemSubText}>{date.dateString}</Text>
				</View>
			</View>
			<MaterialCommunityIcons name={"trash-can-outline"} size={32} onPress={onRemove} style={{ paddingLeft: 5, marginRight: 0 }} color="gray" />
			{/* </View> */}
		</View>
	);
};
