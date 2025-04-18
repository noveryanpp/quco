import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { API_BASE_URL } from "@/utils/api";

export function NetworkInfo() {
	const [ssid, setSsid] = useState("");
	const [password, setPassword] = useState("");
	const [deviceCount, setDeviceCount] = useState(0);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");
	
				const response = await fetch(`${API_BASE_URL}/api/mikrotik/wlan/get`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
	
				const data = await response.json();
				setSsid(data["SSID"] || "Tidak ditemukan");
			} catch (error) {
				console.error("Error fetching SSID:", error);
			}
		};
	
		fetchData();
	}, []);
	

	useEffect(() => {
		const fetchSecurity = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(`${API_BASE_URL}/api/mikrotik/security/get`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				setPassword(data["wpa2-pre-shared-key"] || "N/A");
			} catch (error) {
				console.error("Error fetching security data:", error);
			}
		};
	
		fetchSecurity();
	}, []);
	
	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await fetch(`${API_BASE_URL}/api/mikrotik/device/get`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				setDeviceCount(data.connected_devices);
			} catch (error) {
				console.error("Error fetching device data:", error);
			}
		};
	
		fetchDevices();
	}, []);
	

	return (
		<View style={styles.container}>
			<View style={styles.infoItem}>
				<Text style={styles.label}>SSID: </Text>
				<Text style={styles.value}>{ssid}</Text>
			</View>
			<View style={styles.infoItem}>
				<Text style={styles.label}>Password: </Text>
				<Text style={styles.value}>
					{showPassword ? password : "••••••••"}
				</Text>
				<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
					<Text style={styles.eyeIcon}>
						{showPassword ? "🙈" : "👁️"}
					</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.infoItem}>
				<Text style={styles.label}>Perangkat Terhubung: </Text>
				<Text style={styles.value}>{deviceCount}</Text>
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
		alignItems: "center",
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
	eyeIcon: {
		fontSize: 18,
		marginLeft: 8,
	},
});
