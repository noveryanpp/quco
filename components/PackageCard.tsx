import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function PackageCard() {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Internet 30 Mbps</Text>
          <Text style={styles.speed}>30 Mbps</Text>
          <Text style={styles.duration}>30 Hari</Text>
        </View>
        <Text style={styles.price}>Rp. 265.000</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  speed: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  duration: {
    fontSize: 16,
    color: '#6b7280',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});