import React, {useState} from "react";
import { Button, Modal, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { BottomModal } from "./BottomModal";
import { Ionicons } from "@expo/vector-icons";

export function PackageCard() {
	const [modalVisible, setModalVisible] = useState(false);
  
  const handleClose = () => {
    setModalVisible(false)
  }

	return (
		<>
			<TouchableOpacity style={styles.container} onPress={() => setModalVisible(true)}>
				<View style={styles.content}>
					<View>
						<Text style={styles.title}>Internet 30 Mbps</Text>
						<Text style={styles.speed}>30 Mbps</Text>
						<Text style={styles.duration}>30 Hari</Text>
					</View>
					<Text style={styles.price}>Rp. 265.000</Text>
				</View>
			</TouchableOpacity>
			<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
					  <Ionicons name="close" size={24} color="#fff"/>
          </TouchableOpacity>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>This is a bottom sheet!</Text>            
          </View>
        </View>
      </Modal>
		</>
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
    justifyContent: 'fix-end',
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
    color: '#FFF',
    justifyContent: "flex-end",
    width: 32,
    height: 32,
  },
});
