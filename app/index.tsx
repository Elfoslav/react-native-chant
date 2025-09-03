import { useMemo, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import {
	ScrollView,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useTimer } from "../lib/context/TimerContext";
import { colors } from "../lib/colors";
import { defaultFont } from "../lib/fonts";

const oneDigitDots = "........................";
const doubleDigitDots = "......................";
const SWIPE_THRESHOLD = -50;
const HORIZONTAL_TOLERANCE = 200;

export default function Index() {
	const { showRounds, count, rounds, roundsList, handleChant, formatTime } =
		useTimer();

	const nativeScroll = Gesture.Native();

	const swipeDownGesture = useMemo(
		() =>
			Gesture.Pan()
				.onFinalize((event) => {
					try {
						const translationY = event.translationY ?? 0;
						const translationX = event.translationX ?? 0;
						if (
							translationY < SWIPE_THRESHOLD &&
							Math.abs(translationX) < HORIZONTAL_TOLERANCE
						) {
							runOnJS(handleChant)();
						}
					} catch (e) {
						console.log(e);
					}
				})
				.requireExternalGestureToFail(nativeScroll),
		[handleChant, nativeScroll]
	);

	useEffect(() => {
		Toast.show({
			type: "customToast", // 'success' | 'error' | 'info'
			text1: "Info",
			text2: "Swipe down to trigger counter & timer",
			position: "bottom",
			visibilityTime: 4500, // milliseconds
		});
	}, []);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={swipeDownGesture}>
				<View style={styles.mainView}>
					{/* Current round */}
					<View style={[styles.flexRow, { marginTop: 15 }]}>
						<View style={styles.dot} />
						<Text style={styles.bigText}>{count}</Text>
					</View>

					{/* Total rounds */}
					<View style={styles.flexRow}>
						<Image
							source={require("../assets/images/icons/pin.png")}
							style={[styles.icon, styles.iconSpacing]}
						/>
						<Text style={styles.bigText}>{rounds}</Text>
					</View>

					{/* Scrollable rounds list */}
					{showRounds && (
						<ScrollView
							style={styles.roundsWrapper}
							contentContainerStyle={{ alignItems: "center" }}
							scrollEventThrottle={16}
							showsVerticalScrollIndicator={false}
						>
							{roundsList.map((r) => (
								<Text key={r.round} style={styles.rounds}>
									{r.round} {r.round < 10 ? oneDigitDots : doubleDigitDots}{" "}
									{formatTime(r.time)}
								</Text>
							))}
						</ScrollView>
					)}
				</View>
			</GestureDetector>
		</GestureHandlerRootView>
	);
}

const styles = StyleSheet.create({
	mainView: {
		flex: 1,
		alignItems: "center",
		marginVertical: 25,
	},
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
		marginTop: 35,
		marginBottom: 60,
	},
	rounds: {
		fontFamily: defaultFont,
		fontSize: 22,
		color: colors.text,
	},
});
