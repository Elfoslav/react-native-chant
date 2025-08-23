import { useEffect } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { colors } from "../lib/colors";
import { defaultFont } from "@/lib/fonts";
import { SettingsProvider } from "../lib/context/SettingsContext";

// 👈 prevent auto-hide until fonts are ready
SplashScreen.preventAutoHideAsync();

const MyDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: colors.bg, // main app background
		card: colors.bg, // drawer background
		text: colors.text, // drawer + headers text
	},
};

export default function Layout() {
	const [loadedFont, error] = useFonts({
		"DINCondensed-Bold": require("../assets/fonts/din-condensed-bold.ttf"),
		"SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loadedFont || error) {
			SplashScreen.hideAsync();
		}
	}, [loadedFont, error]);

	if (!loadedFont) {
		return null; // or splash screen
	}

	return (
		<SettingsProvider>
			<GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
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
							options={{
								drawerLabel: "Chant!",
								title: "",
							}}
						/>
						<Drawer.Screen
							name="settings"
							options={{ drawerLabel: "Settings", title: "" }}
						/>
					</Drawer>
				</ThemeProvider>
			</GestureHandlerRootView>
		</SettingsProvider>
	);
}
