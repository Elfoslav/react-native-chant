import { useState } from "react";
import { View, Pressable, Text, Image } from "react-native";
import { Drawer } from "expo-router/drawer";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import {
	DrawerActions,
	ThemeProvider,
	DarkTheme,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/lib/colors";
import { defaultFont } from "@/lib/fonts";
import { useTimerContext } from "@/lib/context/TimerContext";

const HEADER_ICON_SIZE = 36;

type DrawerParamList = {
	index: undefined;
	settings: undefined;
};

export const AppDrawer = () => {
	const {
		time,
		startTimer,
		pauseTimer,
		formatTime,
		showRounds,
		isRunning,
		toggleShowRounds,
	} = useTimerContext();

	const renderHeaderLeft = (
		navigation: DrawerNavigationProp<DrawerParamList>
	) => (
		<Pressable
			onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
			style={{ marginLeft: 15 }}
		>
			<Ionicons name="menu-outline" size={HEADER_ICON_SIZE + 2} color="red" />
		</Pressable>
	);

	const MyDarkTheme = {
		...DarkTheme,
		colors: {
			...DarkTheme.colors,
			background: colors.bg,
			card: colors.bg,
			text: colors.text,
		},
	};

	return (
		<ThemeProvider value={MyDarkTheme}>
			<Drawer
				screenOptions={{
					swipeEnabled: false, // 🚫 disables opening drawer by swiping
					drawerStyle: { backgroundColor: colors.bg },
					headerStyle: { backgroundColor: colors.bg },
					headerTintColor: colors.text,
					// headerTitleStyle: {
					// 	fontFamily: "DINCondensed-Bold",
					// },
					drawerLabelStyle: {
						color: colors.text,
						fontFamily: defaultFont, // 👈 set your custom font here
						fontSize: 24,
					},
				}}
			>
				<Drawer.Screen
					name="index"
					options={({ navigation }) => ({
						drawerLabel: "Chant!",
						title: "",
						headerRight: () => (
							<View
								style={{
									flex: 1,
									flexDirection: "row",
									gap: 40,
									marginTop: 30,
									marginLeft: 20,
								}}
							>
								<Pressable
									onPress={toggleShowRounds}
									style={({ pressed }) => ({
										opacity: pressed ? 0.3 : 1, // blink effect on touch
									})}
								>
									<Image
										source={require("../assets/images/icons/stopwatch.png")}
										style={{
											width: HEADER_ICON_SIZE,
											height: HEADER_ICON_SIZE,
											resizeMode: "contain",
											tintColor: showRounds ? colors.textActive : colors.text,
										}}
									/>
								</Pressable>
								<Pressable
									onPress={startTimer}
									style={({ pressed }) => ({
										opacity: pressed ? 0.3 : 1, // blink effect on touch
									})}
								>
									<Ionicons
										name="play"
										size={HEADER_ICON_SIZE}
										color={isRunning ? colors.textActive : colors.text}
									/>
								</Pressable>
								<Pressable
									onPress={pauseTimer}
									style={({ pressed }) => ({
										opacity: pressed ? 0.3 : 1, // blink effect on touch
									})}
								>
									<Ionicons
										name="pause"
										size={HEADER_ICON_SIZE}
										color={!isRunning ? colors.textActive : colors.text}
									/>
								</Pressable>
								<View style={{ flexDirection: "column", alignItems: "center" }}>
									<Text
										style={{
											color: colors.text,
											fontSize: 32,
											fontFamily: defaultFont,
										}}
									>
										LAP
									</Text>
									<Text
										style={{
											color: colors.text,
											fontSize: 26,
											fontFamily: defaultFont,
										}}
									>
										{formatTime(time)}
									</Text>
								</View>
							</View>
						),
						headerLeft: () => renderHeaderLeft(navigation),
					})}
				/>
				<Drawer.Screen
					name="settings"
					options={({ navigation }) => ({
						drawerLabel: "Settings",
						title: "",
						headerLeft: () => renderHeaderLeft(navigation),
					})}
				/>
			</Drawer>
		</ThemeProvider>
	);
};
