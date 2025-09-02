import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Linking,
	Alert,
} from "react-native";
import { colors } from "../lib/colors";
import { defaultFont } from "../lib/fonts";

export default function AboutPage() {
	const openWebsite = async (url: string) => {
		// Check if the link can be opened
		const supported = await Linking.canOpenURL(url);

		if (supported) {
			await Linking.openURL(url);
		} else {
			Alert.alert(`Don't know how to open this URL: ${url}`);
		}
	};

	return (
		<View style={styles.container}>
			<View style={[styles.centeredRow]}>
				<Text style={styles.text}>Hare Krishna Hare Krishna</Text>
			</View>
			<View style={[styles.centeredRow]}>
				<Text style={styles.text}>Krishna Krishna Hare Hare</Text>
			</View>
			<View style={[styles.centeredRow]}>
				<Text style={styles.text}>Hare Ráma Hare Ráma</Text>
			</View>
			<View style={[styles.centeredRow]}>
				<Text style={styles.text}>Ráma Ráma Hare Hare</Text>
			</View>

			<View style={styles.link}>
				<TouchableOpacity
					onPress={() =>
						openWebsite("https://www.iskcon.org/about-us/what-is-iskcon.php")
					}
				>
					<Text style={[styles.text, { textDecorationLine: "underline" }]}>
						www.iskcon.org
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginVertical: 20,
		alignItems: "center",
	},
	centeredRow: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 0,
	},
	text: {
		fontFamily: defaultFont,
		fontSize: 26,
		color: colors.text,
	},
	link: {
		alignItems: "center",
		marginTop: 40,
	},
});
