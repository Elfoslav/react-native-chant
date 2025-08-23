import { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../lib/colors";
import { defaultFont } from "@/lib/fonts";
import CustomCheckbox from "../components/CustomCheckbox";
import { useSettings } from "../lib/context/SettingsContext";

const ACTIONS = {
	RESET_COUNTER: "resetCounter",
	VIBRATE_ON_EACH: "vibrateOnEach",
	LONG_VIBRATE_ON_TAP: "longVibrateOnLap",
	VOLUME_BUTTON_SWIPES: "volumeButtonSwipes",
	STOPWATCH: "stopwatch",
} as const;

export default function SettingsPage() {
	const { settings, updateSetting } = useSettings();

	return (
		<View style={styles.container}>
			<View style={styles.flexRow}>
				<Text
					style={styles.text}
					onPress={() =>
						updateSetting(ACTIONS.RESET_COUNTER, !settings.resetCounter)
					}
				>
					reset counter
				</Text>
				<CustomCheckbox
					checked={settings.resetCounter}
					onChange={() =>
						updateSetting(ACTIONS.RESET_COUNTER, !settings.resetCounter)
					}
				/>
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
			<View style={styles.flexRow}>
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
			</View>
			<View style={styles.flexRow}>
				<Text
					style={styles.text}
					onPress={() => updateSetting(ACTIONS.STOPWATCH, !settings.stopwatch)}
				>
					stopwatch
				</Text>
				<CustomCheckbox
					checked={settings.stopwatch}
					onChange={() => updateSetting(ACTIONS.STOPWATCH, !settings.stopwatch)}
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
});
