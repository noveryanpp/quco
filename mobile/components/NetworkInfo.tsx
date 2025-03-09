import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function NetworkInfo() {
	return (
		<View style={styles.container}>
			<View style={styles.infoItem}>
				<Text style={styles.label}>SSID: </Text>
				<Text style={styles.value}>labpemroo</Text>
			</View>
			<View style={styles.infoItem}>
				<Text style={styles.label}>Password: </Text>
				<Text style={styles.value}>********</Text>
			</View>
			<View style={styles.infoItem}>
				<Text style={styles.label}>Perangkat Terhubung: </Text>
				<Text style={styles.value}>3</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		marginHorizontal: 16,
	},
	infoItem: {
		flexDirection: "row",
		marginBottom: 8,
	},
	label: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	value: {
		color: "#fff",
		fontSize: 16,
	},
});
