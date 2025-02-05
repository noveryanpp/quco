import React, { useState } from "react";
import { Image, StyleSheet, Platform } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import ThemedTextInput from "@/components/ThemedTextInput";

export default function HomeScreen() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	return (
		<>
			<ThemedView style={styles.container}>
				<Image
					source={require("@/assets/images/icon.svg")}
					style={styles.logo}
				/>
				<ThemedTextInput
					label="Username"
					onChangeText={setUsername}
					value={username}
				/>
			</ThemedView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 24,
		gap: 4,
	},
	logo: {
		alignSelf: "center",
	},
});
