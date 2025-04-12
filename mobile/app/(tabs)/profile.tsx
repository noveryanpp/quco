import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [originalUser, setOriginalUser] = useState({});

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

  const handleSave = async () => {
    try {
      const token = await localStorage.getItem("token");
      let updateRequests = [];
  
      if (user.name !== originalUser.name) {
        updateRequests.push(
          fetch("http://localhost:5000/update_name", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ new_name: user.name }),
          })
        );
      }
  
      if (user.username !== originalUser.username) {
        updateRequests.push(
          fetch("http://localhost:5000/update_username", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ new_username: user.username }),
          })
        );
      }
  
      if (user.phone !== originalUser.phone) {
        updateRequests.push(
          fetch("http://localhost:5000/update_phone", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ new_phone: user.phone }),
          })
        );
      }
  
      if (user.password) {
        updateRequests.push(
          fetch("http://localhost:5000/update_password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              new_password: user.password, // Hanya mengirim password baru
            }),
          })
        );
      }      
  
      if (updateRequests.length > 0) {
        await Promise.all(updateRequests); // Jalankan semua request secara paralel
        alert("Profil berhasil diperbarui!");
        setOriginalUser(user); // Perbarui data awal setelah berhasil
      } else {
        alert("Tidak ada perubahan yang disimpan.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Profil</Text>

      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${user.name}&background=3498db&color=fff&size=120` }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nama</Text>
          <TextInput
            style={styles.input}
            value={user.name}
            onChangeText={(text) => setUser({ ...user, name: text })}
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={(text) => setUser({ ...user, username: text })}
            placeholderTextColor="#6b7280"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>No. Telp</Text>
          <TextInput
            style={styles.input}
            value={user.phone}
            onChangeText={(text) => setUser({ ...user, phone: text })}
            placeholderTextColor="#6b7280"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              style={[styles.input, { paddingRight: 40 }]} // ruang untuk ikon
              value={user.password}
              placeholder='Password'
              onChangeText={(text) => setUser({ ...user, password: text })}
              placeholderTextColor="#6b7280"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: [{ translateY: -10 }],
              }}
            >
              <Text style={{ fontSize: 16, color:'#fff' }}>
                {showPassword ? "Sembunyikan" : "Tampilkan"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Simpan</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1d21',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
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
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});