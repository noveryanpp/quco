import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserHeader } from "../../components/UserHeader";
import { ActivePackage } from "../../components/ActivePackage";
import { PackageCard } from "../../components/PackageCard";
import { SpeedTest } from "../../components/SpeedTest";
import { NetworkInfo } from "../../components/NetworkInfo";

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				<UserHeader />
				<NetworkInfo />
				<ActivePackage />
				<SpeedTest />
				<View style={styles.packagesSection}>
					<View style={styles.header}>
						<Text style={styles.title}>Paket untuk Anda</Text>
						<Text style={styles.link}>Lihat Semua</Text>
					</View>
					<PackageCard />
				</View>
			</ScrollView>
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
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
	link: {
		color: "#3498db",
		fontSize: 16,
	},
});
