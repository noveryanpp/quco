import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from '@react-native-picker/picker';

export default function SettingsScreen() {
	const [user, setUser] = useState({
		ssid: "",
		chanel: "",
		passwd: "",
		dns: "",
	  });
	  
	const [deviceCount, setDeviceCount] = useState(0);
	const [devices, setDevices] = useState([]);

		useEffect(() => {
			const fetchUserData = async () => {
			try {
				let token = localStorage.getItem("token");
				console.log("Token dari SecureStore:", token);
		
				if (!token) {
				Alert.alert("Error", "Token tidak ditemukan!");
				return;
				}
		
				const response = await fetch("http://localhost:5000/auth/get_users", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				});
		
				const data = await response.json();
				console.log("Response dari API:", data);
		
				if (response.ok && data.name) {
				setUser(data);
				} else {
				Alert.alert("Error", data.message || "Gagal mengambil data user");
				}
			} catch (error) {
				console.error("Fetch user error:", error);
				Alert.alert("Error", "Gagal mengambil data user");
			}
			};
		
			fetchUserData();
		}, []);
		
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
			const token = localStorage.getItem("token");
		
			const headers = {
			  "Content-Type": "application/json",
			  Authorization: `Bearer ${token}`,
			};
		
			if (user.ssid) {
			  updateRequests.push(
				fetch("http://localhost:5000/api/mikrotik/ssid/edit", {
				  method: "POST",
				  headers,
				  body: JSON.stringify([{ newSSID: user.ssid }]),
				})
			  );
			}
		
			if (user.dns) {
			  updateRequests.push(
				fetch("http://localhost:5000/api/mikrotik/dns/edit", {
				  method: "POST",
				  headers,
				  body: JSON.stringify([{ newDNS: user.dns }]),
				})
			  );
			}
		
			if (user.passwd) {
			  updateRequests.push(
				fetch("http://localhost:5000/api/mikrotik/security/edit", {
				  method: "POST",
				  headers,
				  body: JSON.stringify([{ newPasswd: user.passwd }]),
				})
			  );
			}
		
			if (user.chanel) {
			  updateRequests.push(
				fetch("http://localhost:5000/api/mikrotik/chanel/edit", {
				  method: "POST",
				  headers,
				  body: JSON.stringify([{ newFrequency: user.chanel }]),
				})
			  );
			}
		
			try {
				await Promise.all(updateRequests);
				window.alert("Konfigurasi berhasil diperbarui!");
			  } catch (error) {
				console.error("Error saat menyimpan:", error);
				window.alert("Terjadi kesalahan saat memperbarui konfigurasi.");
			  }
			};
	  

		const handleBlockUser = (mac_address) => {
		if (Platform.OS === "web") {
			const confirmed = window.confirm("Apakah Anda ingin memblokir pengguna?");
			if (confirmed) {
			sendBlockRequest(mac_address); // ✅ pastikan parameternya mac_address
			}
		} else {
			Alert.alert(
			"Konfirmasi",
			"Apakah Anda ingin memblokir pengguna?",
			[
				{ text: "Batal", style: "cancel" },
				{ text: "Blokir", onPress: () => sendBlockRequest(mac_address) },
			],
			{ cancelable: true }
			);
		}
		};

		const sendBlockRequest = async (mac_address) => {
		try {
			const token = localStorage.getItem("token");
			const headers = {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			};

			const response = await fetch("http://localhost:5000/api/mikrotik/wlan/device/block", {
			method: "POST",
			headers,
			body: JSON.stringify([{ mac_address }]), // ✅ UBAH KEYNYA DI SINI
			});

			const result = await response.json();
			console.log("Block result:", result);

			if (response.ok && result.status === "success") {
			Platform.OS === "web"
				? window.alert("Perangkat berhasil diblokir!")
				: Alert.alert("Sukses", "Perangkat berhasil diblokir!");
			} else {
			Platform.OS === "web"
				? window.alert("Gagal memblokir perangkat: " + (result.message || "Unknown error"))
				: Alert.alert("Gagal", result.message || "Gagal memblokir perangkat");
			}
		} catch (error) {
			console.error("Error blocking device:", error);
			Platform.OS === "web"
			? window.alert("Terjadi kesalahan saat memblokir perangkat.")
			: Alert.alert("Error", "Terjadi kesalahan saat memblokir perangkat.");
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
					value={user.ssid}
					onChangeText={(text) => setUser({ ...user, ssid: text })}
					/>
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Password</Text>
					<TextInput
					style={styles.input}
					placeholder="Enter Password"
					placeholderTextColor="#6b7280"
					secureTextEntry
					value={user.passwd}
					onChangeText={(text) => setUser({ ...user, passwd: text })}
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
				<View style={styles.input}>
					<Picker
					selectedValue={user.chanel}
					onValueChange={(itemValue) =>
						setUser({ ...user, chanel: itemValue })
					}
					style={{
						color: '#fff',
						fontSize: 16,
						width: '100%',
						backgroundColor: 'transparent', // biar match dengan parent view
						borderWidth: 0,
					}}
					dropdownIconColor="#fff"
					>
						<Picker.Item label="2412" value="2412"/>
						<Picker.Item label="2417" value="2417"/>
						<Picker.Item label="2422" value="2422"/>
						<Picker.Item label="2427" value="2427"/>
						<Picker.Item label="2432" value="2432"/>
					</Picker>
				</View>
				</View>

				<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
					<Text style={styles.saveButtonText}>Simpan</Text>
				</TouchableOpacity>
{/* <Text style={styles.label}>Login sebagai: {user.ip}</Text> */}

				<View style={styles.connectedDevices}>
					<Text style={styles.devicesTitle}>Perangkat Terhubung : {deviceCount}</Text>
					<ScrollView style={{ maxHeight: 100 }}>
					{devices.map((device, index) => (
						<View key={index} style={styles.deviceItem}>
						<View>
							<Text style={styles.deviceName}>{device.device_name}</Text>
							<Text style={styles.deviceMac}>{device.mac_address}</Text>
						</View>
						<TouchableOpacity onPress={() => handleBlockUser(device.mac_address)}>
							<Text style={styles.deviceMenu}>🚫</Text>
						</TouchableOpacity>
						</View>
					))}
					</ScrollView>
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
		marginBottom: 10,
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
		paddingRight: 7,
	},
});
