import { View } from "react-native";
import style from "../styles/Styles";
import { LinearGradientBG } from "../components/LinearGradientBG";
import { BarChart } from "react-native-gifted-charts";
import { ScrollView } from "react-native-gesture-handler";
import AvatarIconNavigatesProfile from "../components/AvatarIconNavigatesProfile";
import { AddNewToBuIcon } from "../components/AddNewToBuIcon";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { IconButton, Text } from "react-native-paper";
import { blue } from "../components/Colors";
import { collection, onSnapshot } from "firebase/firestore";
import { db, MONEY_REF, USERS_REF } from "../firebase/Config";
import { auth } from "../firebase/Config";
import { AddNewBudgetModal } from "../components/AddNewBudgetModal";
import { BudgetItem } from "../components/BudgetItem";

const expenseColor = {
	frontColor: "#FF0000", // Red
	gradientColor: "#FF0000", // Gradient red
};

const incomeColor = {
	frontColor: "#006DFF",
	gradientColor: "#009FFF",
};
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Budget({ navigation }) {
	const [todos, setTodos] = useState([]);
	const [modalVisible, setModalVisible] = useState(false);
	const [graphData, setGraphData] = useState([]);
	const [max, setMax] = useState(10);

	useEffect(() => {
		let unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const subColRef = collection(db, USERS_REF, auth.currentUser.uid, MONEY_REF);
				unsubscribe = onSnapshot(subColRef, (querySnapshot) => {
					const sortedData = querySnapshot.docs
						.map((doc) => ({
							id: doc.id,
							...doc.data(),
						}))
						.sort((a, b) => new Date(a.date.timestamp) - new Date(b.date.timestamp));

					setTodos(sortedData);

					// Initialize arrays for income and expenses for all 12 months
					const { incomeByMonth, expensesByMonth } = sortedData.reduce(
						(acc, item) => {
							const monthIndex = item.date.month - 1;
							const amount = parseFloat(item.amount);
							if (item.category === "1") {
								acc.incomeByMonth[monthIndex] += amount;
							} else if (item.category === "2") {
								acc.expensesByMonth[monthIndex] += amount;
							}
							return acc;
						},
						{ incomeByMonth: Array.from({ length: 12 }, () => 0), expensesByMonth: Array.from({ length: 12 }, () => 0) }
					);

					let graphData = [];
					for (let i = 0; i < 12; i++) {
						graphData.push(
							{
								value: incomeByMonth[i],
								...incomeColor,
								spacing: 2,
								label: months[i],
							},
							{
								value: expensesByMonth[i],
								...expenseColor,
							}
						);
					}
					setGraphData(graphData);

					//here we are setting the max value of y axis
					const max = Math.max(...incomeByMonth, ...expensesByMonth);
// 					//if max value is greater than 10 then we are increasing it by 15%					
					if(max>10)setMax(max + max * 0.15);
				});
			} else {
				unsubscribe();
			}
		});
		return () => {
			unsubscribe();
		};
	}, []);

	let todosKeys = Object.keys(todos);
	return (
		<View style={[style.container, {}]}>
			<LinearGradientBG />
			<View style={style.headerItem}>
				<Text variant="headlineLarge" style={{ marginTop: 10 }}>
					Budget
				</Text>
				<AvatarIconNavigatesProfile navigation={navigation} />
			</View>
			<View
				style={{
					margin: 10,
					paddingVertical: 16,
					borderRadius: 20,
					backgroundColor: "#232B5D",
				}}
			>
				<Text style={{ color: "white", fontSize: 16, fontWeight: "bold", margin: 15 }}>Overview</Text>
				<View style={{ padding: 20, alignItems: "center" }}>
					{graphData.length > 0 && (
						<BarChart
							data={graphData}
							barWidth={6}
							initialSpacing={0}
							spacing={14}
							barBorderRadius={4}
							showGradient
							roundedTop
							roundedBottom
							xAxisThickness={0}
							yAxisThickness={0}
							yAxisTextStyle={{ color: "gray" }}
							noOfSections={3}
							maxValue={max}
							labelWidth={25}
							xAxisLabelTextStyle={{ color: "lightgray", textAlign: "start" }}
							yAxisLabelTextStyle={{ color: "lightgray", textAlign: "center" }}
							isAnimated
						/>
					)}
				</View>
			</View>
			<View style={style.innercontainer}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
					{todosKeys && todosKeys.length > 0 ? (
						<>
							{todosKeys.map((key, i) => (
								<BudgetItem key={key} amount={todos[key].amount} date={todos[key].date} moneyId={todos[key].id} category={todos[key].category} />
							))}
						</>
					) : (
						<>
							<Text style={style.h2text}>You have not added any incomes or expenses</Text>
							<Text style={style.infoText}>Start adding by pressing the "+" icon </Text>
							<IconButton style={{ alignSelf: "center" }} icon="plus-circle" iconColor={blue} size={80} onPress={() => setModalVisible(true)} />
							
						</>
					)}
				</ScrollView>
			</View>
			<AddNewBudgetModal isVisible={modalVisible} onClose={() => setModalVisible(false)} todosKeys={todosKeys} todos={todos} />
			<View style={style.viewbottom} />
			<AddNewToBuIcon onPress={() => setModalVisible(true)} />
		</View>
	);
}
