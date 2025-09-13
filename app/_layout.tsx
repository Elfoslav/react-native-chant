import { useEffect } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { colors } from "../lib/colors";
import { SettingsProvider } from "../lib/context/SettingsContext";
import { CounterProvider } from "../lib/context/CounterContext";
import { TimerProvider } from "../lib/context/TimerContext";
import { AppDrawer } from "../components/AppDrawer";
import CustomToast from "@/components/CustomToast";

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
		NavigationBar.setButtonStyleAsync("light");
		NavigationBar.setVisibilityAsync("visible");
	}, []);

	useEffect(() => {
		if (loadedFont || error) {
			SplashScreen.hideAsync();
		}
	}, [loadedFont, error]);

	if (!loadedFont) {
		return null; // or splash screen
	}

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
			<SafeAreaProvider>
				<SettingsProvider>
					<CounterProvider>
						<TimerProvider>
							<ThemeProvider value={MyDarkTheme}>
								<StatusBar style="light" backgroundColor="red" />
								<AppDrawer />
								<CustomToast />
							</ThemeProvider>
						</TimerProvider>
					</CounterProvider>
				</SettingsProvider>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}
