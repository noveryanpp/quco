import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserHeader } from "../../components/UserHeader";

export default function SettingsScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Quick Config</Text>

			<View style={styles.form}>
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Service Set Identifier (SSID)</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter SSID"
						placeholderTextColor="#6b7280"
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Password</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter Password"
						placeholderTextColor="#6b7280"
						secureTextEntry
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Domain Name Server (DNS)</Text>
					<TextInput
						style={styles.input}
						placeholder="Enter DNS"
						placeholderTextColor="#6b7280"
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Channel</Text>
					<TextInput
						style={styles.input}
						value="3231"
						placeholderTextColor="#6b7280"
					/>
				</View>

				<TouchableOpacity style={styles.saveButton}>
					<Text style={styles.saveButtonText}>Simpan</Text>
				</TouchableOpacity>

				<View style={styles.connectedDevices}>
					<Text style={styles.devicesTitle}>Perangkat Terhubung : 3</Text>
					<View style={styles.deviceItem}>
						<View>
							<Text style={styles.deviceName}>Redmi Note 9</Text>
							<Text style={styles.deviceMac}>40:f0:23:cg:d2:00</Text>
						</View>
						<TouchableOpacity>
							<Text style={styles.deviceMenu}>⋮</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1a1d21",
		padding: 16,
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		color: "#fff",
		marginVertical: 16,
	},
	form: {
		flex: 1,
	},
	inputGroup: {
		marginBottom: 16,
	},
	label: {
		color: "#fff",
		fontSize: 16,
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#2d3748",
		borderRadius: 8,
		padding: 12,
		color: "#fff",
		fontSize: 16,
	},
	saveButton: {
		backgroundColor: "#3498db",
		borderRadius: 8,
		padding: 16,
		alignItems: "center",
		marginTop: 8,
	},
	saveButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	connectedDevices: {
		marginVertical: 24,
	},
	devicesTitle: {
		color: "#fff",
		fontSize: 16,
		marginBottom: 16,
	},
	deviceItem: {
		backgroundColor: "#2d3748",
		borderRadius: 8,
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	deviceName: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	deviceMac: {
		color: "#6b7280",
		fontSize: 14,
		marginTop: 4,
	},
	deviceMenu: {
		color: "#fff",
		fontSize: 24,
	},
});
