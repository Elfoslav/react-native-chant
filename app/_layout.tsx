import { useEffect } from "react";
import { useFonts } from "expo-font";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
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
		if (loadedFont || error) {
			SplashScreen.hideAsync();
		}
	}, [loadedFont, error]);

	if (!loadedFont) {
		return null; // or splash screen
	}

	return (
		<SettingsProvider>
			<CounterProvider>
				<TimerProvider>
					<GestureHandlerRootView
						style={{ flex: 1, backgroundColor: colors.bg }}
					>
						<ThemeProvider value={MyDarkTheme}>
							<AppDrawer />
							<CustomToast />
						</ThemeProvider>
					</GestureHandlerRootView>
				</TimerProvider>
			</CounterProvider>
		</SettingsProvider>
	);
}
