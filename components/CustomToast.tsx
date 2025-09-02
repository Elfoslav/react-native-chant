import React from "react";
import Toast, { BaseToast, ToastConfig } from "react-native-toast-message";

export default function CustomToast() {
	// Define custom toast type
	const toastConfig: ToastConfig = {
		customToast: ({ text1, text2, props }) => (
			<BaseToast
				style={{
					borderLeftColor: "red",
					backgroundColor: "black",
				}}
				contentContainerStyle={{ paddingHorizontal: 15 }}
				text1Style={{
					fontSize: 17,
					fontWeight: "bold",
					color: "red", //
				}}
				text2Style={{
					fontSize: 15,
					color: "red",
				}}
				text1={text1}
				text2={text2}
			/>
		),
	};

	return <Toast config={toastConfig} />;
}
