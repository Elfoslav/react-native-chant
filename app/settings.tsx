import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Keyboard } from "react-native";
import Toast from "react-native-toast-message";
import { colors } from "../lib/colors";
import { defaultFont } from "../lib/fonts";
import CustomCheckbox from "../components/CustomCheckbox";
import { useSettings } from "../lib/context/SettingsContext";
import { useCounter } from "../lib/context/CounterContext";
import { useTimer } from "../lib/context/TimerContext";

const ACTIONS = {
	VIBRATE_ON_EACH: "vibrateOnEach",
	LONG_VIBRATE_ON_TAP: "longVibrateOnLap",
	VOLUME_BUTTON_SWIPES: "volumeButtonSwipes",
	ROUNDS_COUNT: "roundsCount",
} as const;

export default function SettingsPage() {
	const roundsInputRef = useRef<TextInput>(null);
	const { resetCounter } = useCounter();
	const { stopTimer } = useTimer();
	const { settings, updateSetting } = useSettings();
	const [rounds, setRounds] = useState<number | null>(settings.roundsCount);

	useEffect(() => {
		// Detect press back on keyboard
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				// Keyboard has been dismissed, remove cursor
				roundsInputRef.current?.blur();
			}
		);

		return () => keyboardDidHideListener.remove();
	}, []);

	const onResetCounter = () => {
		Toast.show({
			type: "customToast", // 'success' | 'error' | 'info'
			text1: "Counter reset",
			text2: "The counter has been resetted",
			position: "bottom",
			visibilityTime: 4500, // milliseconds
		});

		resetCounter();
		stopTimer();
	};

	return (
		<View style={styles.container}>
			<View style={styles.flexRow}>
				<Text style={styles.text} onPress={onResetCounter}>
					reset counter
				</Text>
			</View>
			<View style={styles.flexRow}>
				<Text
					style={styles.text}
					onPress={() =>
						updateSetting(ACTIONS.VIBRATE_ON_EACH, !settings.vibrateOnEach)
					}
				>
					vibrate on each
				</Text>
				<CustomCheckbox
					checked={settings.vibrateOnEach}
					onChange={() =>
						updateSetting(ACTIONS.VIBRATE_ON_EACH, !settings.vibrateOnEach)
					}
				/>
			</View>
			<View style={styles.flexRow}>
				<Text
					style={styles.text}
					onPress={() =>
						updateSetting(
							ACTIONS.LONG_VIBRATE_ON_TAP,
							!settings.longVibrateOnLap
						)
					}
				>
					long vibrate on lap
				</Text>
				<CustomCheckbox
					checked={settings.longVibrateOnLap}
					onChange={() =>
						updateSetting(
							ACTIONS.LONG_VIBRATE_ON_TAP,
							!settings.longVibrateOnLap
						)
					}
				/>
			</View>
			{/* <View style={styles.flexRow}>
				<Text
					style={styles.text}
					onPress={() =>
						updateSetting(
							ACTIONS.VOLUME_BUTTON_SWIPES,
							!settings.volumeButtonSwipes
						)
					}
				>
					volume button swipes
				</Text>
				<CustomCheckbox
					checked={settings.volumeButtonSwipes}
					onChange={() =>
						updateSetting(
							ACTIONS.VOLUME_BUTTON_SWIPES,
							!settings.volumeButtonSwipes
						)
					}
				/>
			</View> */}
			<View style={styles.flexRow}>
				<Text style={styles.text}>rounds count</Text>
				<TextInput
					ref={roundsInputRef}
					value={rounds === null ? undefined : String(rounds)}
					style={styles.input}
					keyboardType="numeric"
					selectionColor="red"
					maxLength={3}
					onEndEditing={() =>
						rounds && updateSetting(ACTIONS.ROUNDS_COUNT, rounds)
					}
					onChangeText={(text) => {
						// Parse text into number, fallback to null if empty
						const num = text ? parseInt(text, 10) : null;
						setRounds(num);
					}}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: 250,
		alignSelf: "center",
	},
	flexRow: {
		flexDirection: "row",
		marginVertical: 6,
		alignItems: "center",
		justifyContent: "space-between",
	},
	text: {
		fontFamily: defaultFont,
		fontSize: 26,
		color: colors.text,
	},
	checkbox: {
		borderColor: "red", // 👈 this applies if not checked
		borderWidth: 2,
		borderRadius: 4,
	},
	input: {
		borderColor: "red",
		color: "red",
		borderWidth: 2,
		borderRadius: 4,
		paddingVertical: 0,
		lineHeight: 8,
		height: 30,
		width: 40,
		textAlign: "center",
	},
});
