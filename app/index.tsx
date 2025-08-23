import { useState, useRef } from "react";
import {
	Vibration,
	Platform,
	ScrollView,
	Text,
	View,
	Image,
	StyleSheet,
	Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { useSettings } from "../lib/context/SettingsContext";
import { colors } from "../lib/colors";
import { defaultFont } from "../lib/fonts";

const oneDigitDots = "........................";
const doubleDigitDots = "......................";

export default function Index() {
	const { settings } = useSettings();
	const [counter, setCounter] = useState(0);
	const [rounds, setRounds] = useState(0);
	const [time, setTime] = useState(0); // timer in seconds
	const [roundsList, setRoundsList] = useState<
		{ round: number; time: number }[]
	>([]);

	const intervalRef = useRef<number | null>(null);
	const lastTapRef = useRef(0);

	// Start timer
	const startTimer = () => {
		if (intervalRef.current) return; // prevent multiple intervals
		intervalRef.current = setInterval(() => {
			setTime((prev) => prev + 1);
		}, 1000);
	};

	// Stop and reset timer
	const stopTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setTime(0);
	};

	const handlePress = () => {
		const now = Date.now();
		// debounce: ignore taps within 1 second
		if (now - lastTapRef.current > 1000) {
			lastTapRef.current = now;

			startTimer();

			if (settings.vibrateOnEach) {
				Haptics.selectionAsync();
			}

			if (counter === 3) {
				setCounter(1);
				setRounds((prev) => prev + 1);
				stopTimer(); // stop timer when round increments
				startTimer();

				if (settings.longVibrateOnLap) {
					if (Platform.OS === "android") {
						Vibration.vibrate(500);
					} else {
						// iOS ignores duration/pattern; only short vibration works
						Vibration.vibrate();
					}
				}

				// Add round to the list
				setRoundsList((prev) => [...prev, { round: prev.length + 1, time }]);
			} else {
				setCounter((prev) => prev + 1);
			}
		}
	};

	// Format time in MM:SS
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(2, "0");
		const s = (seconds % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	return (
		<Pressable style={{ flex: 1 }} onPress={handlePress}>
			<ScrollView
				style={{ flex: 1 }}
				contentContainerStyle={{
					flexGrow: 1,
					alignItems: "center",
				}}
			>
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

				{/* Timer */}
				<View style={styles.flexRow}>
					<Image
						source={require("../assets/images/icons/stopwatch.png")}
						style={[styles.icon, styles.iconSpacing]}
					/>
					<Text style={styles.bigText}>{formatTime(time)}</Text>
				</View>

				{/* Dynamic rounds list */}
				<View style={styles.roundsWrapper}>
					{roundsList.map((r) => (
						<Text key={r.round} style={styles.rounds}>
							{r.round} {r.round < 10 ? oneDigitDots : doubleDigitDots}{" "}
							{formatTime(r.time)}
						</Text>
					))}
				</View>
			</ScrollView>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	flexRow: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 0,
		width: 160,
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
		marginTop: 20,
		marginBottom: 60,
	},
	rounds: {
		fontFamily: defaultFont,
		fontSize: 22,
		color: colors.text,
	},
});
