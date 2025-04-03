import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const login = async () => {
    setError(""); // Reset error before attempting login

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response: Response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data: { msg?: string; access_token?: string } = await response.json();

      if (!response.ok || !data.access_token) {
        throw new Error(data.msg || "Login failed");
      }

      // ✅ Save token securely
      const isAvailable = await SecureStore.isAvailableAsync();
      if(isAvailable){
        await SecureStore.setItemAsync("jwt_token", data.access_token);
      } else {
        localStorage.setItem("token", data.access_token);
      }

      Alert.alert("Success", "Login successful!");
      
      // ✅ Navigate to the home screen or bottom tab navigator
      navigation.replace("(tabs)");

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://ui-avatars.com/api/?name=Noveryan&background=3498db&color=fff&size=120" }}
            style={styles.avatar}
          />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={(text) => setUsername(text)}
              placeholder="Enter your username"
              placeholderTextColor="#6b7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Enter your password"
              placeholderTextColor="#6b7280"
              secureTextEntry
            />
          </View>

          {/* Show error if exists */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Login Button */}
          <TouchableOpacity style={styles.saveButton} onPress={login}>
            <Text style={styles.saveButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1d21",
    padding: 24,
    justifyContent: "center",
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    marginTop: 32,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ff4d4d",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
});

