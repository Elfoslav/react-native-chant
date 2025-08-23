import { Pressable, View, StyleSheet, ViewStyle } from "react-native";

type CustomCheckboxProps = {
	checked: boolean;
	onChange: () => void;
	style?: ViewStyle; // allow custom styles from parent
};

export default function CustomCheckbox({
	checked,
	onChange,
	style,
}: CustomCheckboxProps) {
	return (
		<Pressable onPress={onChange} style={style}>
			<View style={styles.box}>
				{checked && (
					<View style={styles.tickContainer}>
						<View style={styles.tickLine1} />
						<View style={styles.tickLine2} />
					</View>
				)}
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	box: {
		width: 24,
		height: 24,
		borderWidth: 2,
		borderColor: "red",
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
	},
	tickContainer: {
		width: 12,
		height: 12,
		position: "relative",
	},
	tickLine1: {
		position: "absolute",
		width: 3,
		height: 13,
		backgroundColor: "red",
		transform: [{ rotate: "45deg" }],
		left: 6.5,
		top: -1,
		borderRadius: 2,
	},
	tickLine2: {
		position: "absolute",
		width: 3,
		height: 8,
		backgroundColor: "red",
		transform: [{ rotate: "-45deg" }],
		left: 1,
		top: 3,
		borderRadius: 2,
	},
});
