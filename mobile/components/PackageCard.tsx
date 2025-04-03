import React, { useState, useEffect } from "react";
import { Button, Modal, View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PackageCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch("http://localhost:5000/get_paket");
        const data = await response.json();

        if (response.ok) {
          setPackages(data);
        } else {
          console.error("Gagal mengambil data paket:", data.message);
        }
      } catch (error) {
        console.error("Error fetching packages:", error);
      }
    };

    fetchPackages();
  }, []);

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <FlatList
      data={packages}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <>
          <TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
            <View style={styles.content}>
              <View>
                <Text style={styles.title}>{item.nama}</Text>
                <Text style={styles.speed}>{item.kecepatan} Mbps</Text>
                <Text style={styles.duration}>{item.masa_aktif} Hari</Text>
              </View>
              <Text style={styles.price}>Rp. {item.harga}</Text>
            </View>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleClose}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Detail Paket: {item.nama}</Text>
                <Text style={styles.modalText}>Kecepatan: {item.kecepatan}</Text>
                <Text style={styles.modalText}>Masa Aktif: {item.masa_aktif}</Text>
                <Text style={styles.modalText}>Harga: Rp. {item.harga}</Text>
              </View>
            </View>
          </Modal>
        </>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#2d3748",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  content: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  speed: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: "#6b7280",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#2d3748",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  modalContent: {
    paddingTop: 32,
  },
  modalText: {
    color: "#FFF",
  },
  closeButton: {
    justifyContent: "flex-end",
    width: 32,
    height: 32,
  },
});
