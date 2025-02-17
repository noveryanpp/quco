import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export function UserHeader() {
	return (
		<View style={styles.container}>
			<Image
				source={{
					uri: "https://ui-avatars.com/api/?name=Noveryan&background=3498db&color=fff",
				}}
				style={styles.avatar}
			/>
			<View style={styles.info}>
				<Text style={styles.name}>Noveryan</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		paddingTop: 32,
		padding: 16,
		backgroundColor: "#1a1d21",
		alignItems: "center",
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		marginRight: 16,
	},
	info: {
		flex: 1,
	},
	name: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
});
