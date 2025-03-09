import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserHeader } from "../../components/UserHeader";
import { PackageCard } from "../../components/PackageCard";

export default function SpeedTestScreen() {
	const [downloadSpeed, setDownloadSpeed] = useState("20.9");
	const [uploadSpeed, setUploadSpeed] = useState("20.9");
	const [isTesting, setIsTesting] = useState(false);

	return (
		<SafeAreaView style={styles.container}>
			<UserHeader />
			<View style={styles.packagesSection}>
				<PackageCard />
				<PackageCard />
				<PackageCard />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1a1d21",
	},
	packagesSection: {
		padding: 16,
	},
});
