import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const ThemedTextInput = ({ label, onChangeText, value, ..inputProps }) => {
	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<TextInput
				style={[styles.input, borderColor "#c0cbd3"]}
				onChangeText={onChangeText}
      	value={value}
				{...inputProps}
			/>
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		marginBottom: 15,
	},
	label: {
		marginBottom: 5,
		fontSize: 16,
	},
	input: {
		height: 40,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
	},
});

export default ThemedTextInput;
