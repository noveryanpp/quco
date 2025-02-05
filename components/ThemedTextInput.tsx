import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const ThemedTextInput = React.forwardRef((props, ref) => {
	const { label, error, ...inputProps } = props;

	return (
		<View style={styles.container}>
			{label && <Text style={styles.label}>{label}</Text>}
			<TextInput
				ref={ref}
				style={[styles.input, { borderColor: error ? "#fc6d47" : "#c0cbd3" }]}
				{...inputProps}
			/>
			{error && <Text style={styles.error}>{error.message}</Text>}
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
	error: {
		marginTop: 5,
		color: "red",
	},
});

export default ThemedTextInput;
