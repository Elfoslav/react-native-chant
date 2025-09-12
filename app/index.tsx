import { useMemo, useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { VolumeManager, VolumeResult } from "react-native-volume-manager";
import {
	ScrollView,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useTimer } from "../lib/context/TimerContext";
import { colors } from "../lib/colors";
import { defaultFont } from "../lib/fonts";
import { useSettings } from "@/lib/context/SettingsContext";
import { defaultSettings } from "@/lib/services/SettingsService";

const oneDigitDots = "........................";
const doubleDigitDots = "......................";
const SWIPE_THRESHOLD = 50;
const HORIZONTAL_TOLERANCE = 200;

export default function Index() {
	const { settings } = useSettings();
	const { showRounds, count, rounds, roundsList, handleChant, formatTime } =
		useTimer();

	const nativeScroll = Gesture.Native();

	const swipeGesture = useMemo(
		() =>
			Gesture.Pan()
				.onFinalize((event) => {
					try {
						const translationY = event.translationY ?? 0;
						const translationX = event.translationX ?? 0;

						// Make sure gesture is "long enough" to be considered a swipe
						if (Math.abs(translationY) < SWIPE_THRESHOLD) {
							return; // too small -> probably just a tap
						}

						// Ensure mostly vertical swipe
						if (Math.abs(translationX) < HORIZONTAL_TOLERANCE) {
							if (
								(settings.countOnSwipeUp ?? defaultSettings.countOnSwipeUp) &&
								translationY < -SWIPE_THRESHOLD // swipe up
							) {
								handleChant();
							} else if (
								(settings.countOnSwipeDown ??
									defaultSettings.countOnSwipeDown) &&
								translationY > SWIPE_THRESHOLD // swipe down
							) {
								handleChant();
							}
						}
					} catch (e) {
						console.log(e);
					}
				})
				.requireExternalGestureToFail(nativeScroll),
		[settings, handleChant, nativeScroll]
	);

	const resetVolume = async (volume: number) => {
		const MIN_VOLUME = 0.08;
		const MAX_VOLUME = 0.93;

		if (volume >= MAX_VOLUME) {
			// At max → nudge slightly down
			await VolumeManager.setVolume(0.93 - Math.random() / 100);
		} else if (volume <= MIN_VOLUME) {
			// At min → nudge slightly up
			await VolumeManager.setVolume(0.14 + Math.random() / 10);
		}
	};

	useEffect(() => {
		const setupVolume = async () => {
			if (settings.countOnVolumePress) {
				await VolumeManager.showNativeVolumeUI({ enabled: false });
				const { volume } = await VolumeManager.getVolume();
				await resetVolume(volume);
			}
		};

		setupVolume();
	}, [settings.countOnVolumePress]);

	useEffect(() => {
		const handleVolume = async (newVolume: VolumeResult) => {
			if (settings.countOnVolumePress) {
				const { volume } = newVolume ?? (await VolumeManager.getVolume());
				console.log("before reset: ", volume);

				await resetVolume(volume);

				console.log("after reset", (await VolumeManager.getVolume()).volume);
				handleChant();
			}
		};

		const volumeListener = VolumeManager.addVolumeListener((result) => {
			handleVolume(result);
		});

		// Remove the volume listener
		return () => volumeListener.remove();
	}, [handleChant, settings.countOnVolumePress]);

	useEffect(() => {
		if (!settings.countOnSwipeDown && !settings.countOnSwipeUp) return;

		let msg = "Swipe UP to trigger counter & timer";

		if (settings.countOnSwipeDown) {
			msg = "Swipe DOWN to trigger counter & timer";
		}

		if (settings.countOnSwipeUp && settings.countOnSwipeDown) {
			msg = "Swipe UP or DOWN to trigger counter & timer";
		}

		Toast.show({
			type: "customToast", // 'success' | 'error' | 'info'
			text1: "Info",
			text2: msg,
			position: "bottom",
			visibilityTime: 4500, // milliseconds
		});
	}, [settings.countOnSwipeUp, settings.countOnSwipeDown]);

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<GestureDetector gesture={swipeGesture}>
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
