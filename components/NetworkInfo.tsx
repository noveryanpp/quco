import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function NetworkInfo() {
  return (
    <View style={styles.container}>
      <View style={styles.infoItem}>
        <Text style={styles.label}>SSID: </Text>
        <Text style={styles.value}>labpemroo</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Password: </Text>
        <Text style={styles.value}>********</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.label}>Perangkat Terhubung: </Text>
        <Text style={styles.value}>3</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2d3748',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    color: '#6b7280',
    fontSize: 16,
  },
  value: {
    color: '#fff',
    fontSize: 16,
  },
});