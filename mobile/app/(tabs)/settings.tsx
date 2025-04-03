import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { Picker } from "@react-native-picker/picker";

export default function SettingsScreen() {
	const [user, setUser] = useState({
		chanel: "2412",
		password: "",
		dns: "",
	  });
	const [deviceCount, setDeviceCount] = useState(0);
	const [devices, setDevices] = useState([]);
		useEffect(() => {
			const fetchDevices = async () => {
				try {
					const response = await fetch("http://localhost:5000/api/mikrotik/device/get");
					const data = await response.json();
					setDevices(data.devices);
					setDeviceCount(data.connected_devices);
				} catch (error) {
					console.error("Error fetching device data:", error);
				}
			};
	
			fetchDevices();
		}, []);

		const handleSave = async () => {
			const updateRequests = [];
		  
			if (user.dns) {
			  updateRequests.push(
				fetch("http://localhost:5000/api/mikrotik/dns/edit", {
				  method: "POST",
				  headers: {
					"Content-Type": "application/json",
				  },
				  body: JSON.stringify([{ newDNS: user.dns }]),
				})
			  );
			}
		  
			if (user.password) {
			  updateRequests.push(
				fetch("http://localhost:5000/api/mikrotik/security/edit", {
				  method: "POST",
				  headers: {
					"Content-Type": "application/json",
				  },
				  body: JSON.stringify([{ newPassword: user.password }]),
				})
			  );
			}
		  
			// if (user.chanel) {
			//   updateRequests.push(
			// 	fetch("http://localhost:5000/api/mikrotik/wlan/ssid/edit", {
			// 	  method: "POST",
			// 	  headers: {
			// 		"Content-Type": "application/json",
			// 	  },
			// 	  body: JSON.stringify([{ newFrequency: user.chanel }]),
			// 	})
			//   );
			// }
		  
			try {
			  await Promise.all(updateRequests);
			  Alert.alert("Sukses", "Konfigurasi berhasil diperbarui!");
			} catch (error) {
			  console.error(error);
			  Alert.alert("Error", "Terjadi kesalahan saat memperbarui konfigurasi.");
			}
		  };
		  
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
					value={user.password}
					onChangeText={(text) => setUser({ ...user, password: text })}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>DNS</Text>
					<TextInput
					style={styles.input}
					placeholder="Enter DNS"
					placeholderTextColor="#6b7280"
					value={user.dns}
					onChangeText={(text) => setUser({ ...user, dns: text })}
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
				<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
					<Text style={styles.saveButtonText}>Simpan</Text>
				</TouchableOpacity>

				<View style={styles.connectedDevices}>
					<Text style={styles.devicesTitle}>Perangkat Terhubung : {deviceCount}</Text>
					<View style={styles.deviceItem}>
						<View>
						<Text style={styles.deviceName}>{devices.device_name}</Text>
                        <Text style={styles.deviceMac}>{devices.mac_address}</Text>
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
