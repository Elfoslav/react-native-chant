import {
	ScrollView,
	Text,
	View,
	Image,
	StyleSheet,
	Pressable,
} from "react-native";
import { useTimerContext } from "../lib/context/TimerContext";
import { colors } from "../lib/colors";
import { defaultFont } from "../lib/fonts";

const oneDigitDots = "........................";
const doubleDigitDots = "......................";

export default function Index() {
	const {
		showRounds,
		counter,
		rounds,
		roundsList,
		handleChantTap,
		formatTime,
	} = useTimerContext();

	return (
		<Pressable style={{ flex: 1 }} onPress={handleChantTap}>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					flexGrow: 1,
					alignItems: "center",
				}}
			>
				<View style={{ marginVertical: 25 }}>
					{/* Current round */}
					<View style={[styles.flexRow, { marginTop: 10 }]}>
						<View style={styles.dot} />
						<Text style={styles.bigText}>{counter}</Text>
					</View>

					{/* Rounds */}
					<View style={styles.flexRow}>
						<Image
							source={require("../assets/images/icons/pin.png")}
							style={[styles.icon, styles.iconSpacing]}
						/>
						<Text style={styles.bigText}>{rounds}</Text>
					</View>
				</View>

				{/* Timer */}
				{/* <View style={styles.flexRow}>
					<Image
						source={require("../assets/images/icons/stopwatch.png")}
						style={[styles.icon, styles.iconSpacing]}
					/>
					<Text style={styles.bigText}>{formatTime(time)}</Text>
				</View> */}

				{showRounds && (
					<View style={styles.roundsWrapper}>
						{roundsList.map((r) => (
							<Text key={r.round} style={styles.rounds}>
								{r.round} {r.round < 10 ? oneDigitDots : doubleDigitDots}{" "}
								{formatTime(r.time)}
							</Text>
						))}
					</View>
				)}
			</ScrollView>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	flexRow: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 0,
		width: 110,
	},
	dot: {
		width: 22,
		height: 22,
		marginLeft: 11,
		marginRight: 38,
		borderRadius: 15,
		backgroundColor: colors.text,
	},
	icon: {
		marginTop: 7,
		width: 48,
		height: 48,
		resizeMode: "contain",
	},
	iconSpacing: {
		marginRight: 25,
	},
	bigText: {
		fontFamily: defaultFont,
		color: colors.text,
		fontSize: 48,
		textAlign: "left",
	},
	roundsWrapper: {
		marginTop: 15,
		marginBottom: 60,
	},
	rounds: {
		fontFamily: defaultFont,
		fontSize: 22,
		color: colors.text,
	},
});
