import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { API_BASE_URL } from "@/utils/api";

export function UserHeader() {
  const [user, setUser] = useState({ name: "Unknown" });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let token = localStorage.getItem("token");
		console.log("Token dari localStorage:", token);

        
        if (!token) {
          Alert.alert("Error", "Token tidak ditemukan!");
          return;
        }

        console.log("Token ditemukan:", token);

		const response = await fetch(`${API_BASE_URL}/auth/get_users`, {
			method: "GET",
			headers: {
			  Authorization: `Bearer ${token}`,
			  "Content-Type": "application/json",
			},
		  });
		  
		  const data = await response.json();
		  console.log("Response dari API:", data);

        if (response.ok && data && data.name) {
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

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `https://ui-avatars.com/api/?name=${user.name}&background=3498db&color=fff`,
        }}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
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
