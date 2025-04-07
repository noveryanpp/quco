import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PackageModal({ id, visible, onClose }) {
  const [item, setItem] = useState(null);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    const fetchPackageById = async () => {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:5000/get_paket/${id}`);
        const data = await response.json();
        setItem(data[0]);
      } catch (error) {
        console.error("Error fetching package:", error);
      }
    };

    fetchPackageById();
  }, [id]);

  const handleBuy = async () => {
    if (!id) return;
    setIsBuying(true);

    try {
      const response = await fetch("http://localhost:5000/buy_package", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ package_id: id }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Sukses", "Paket berhasil dibeli!");
        onClose(); // optionally close the modal
      } else {
        Alert.alert("Gagal", result.message || "Terjadi kesalahan saat membeli paket.");
      }
    } catch (error) {
      console.error("Buy error:", error);
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {!item ? (
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>Loading...</Text>
            </View>
            ) : (
            <View style={styles.modalContent}>
                <Text style={styles.modalText}>Detail Paket: {item.nama}</Text>
                <Text style={styles.modalText}>Kecepatan: {item.kecepatan}</Text>
                <Text style={styles.modalText}>Masa Aktif: {item.masa_aktif}</Text>
                <Text style={styles.modalText}>Harga: Rp. {item.harga}</Text>
                <TouchableOpacity
                onPress={handleBuy}
                style={styles.buyButton}
                disabled={isBuying}
                >
                    <Text style={styles.buyButtonText}>
                        {isBuying ? "Memproses..." : "Beli Paket"}
                    </Text>
                </TouchableOpacity>
            </View>
            
            )}
        </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  buyButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
