import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function SpeedTestScreen() {
  const [downloadSpeed, setDownloadSpeed] = useState('20.9');
  const [uploadSpeed, setUploadSpeed] = useState('20.9');
  const [isTesting, setIsTesting] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tes Kecepatan</Text>
      
      <View style={styles.speedContainer}>
        <View style={styles.speedItem}>
          <Ionicons name="arrow-down" size={24} color="#fff" />
          <Text style={styles.speedLabel}>UNDUH</Text>
          <Text style={styles.speedValue}>{downloadSpeed}</Text>
          <Text style={styles.speedUnit}>Mbps</Text>
        </View>

        <View style={styles.speedItem}>
          <Ionicons name="arrow-up" size={24} color="#fff" />
          <Text style={styles.speedLabel}>UNGGAH</Text>
          <Text style={styles.speedValue}>{uploadSpeed}</Text>
          <Text style={styles.speedUnit}>Mbps</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.startButton, isTesting && styles.startButtonActive]}
        onPress={() => setIsTesting(!isTesting)}
      >
        <Text style={styles.startButtonText}>
          {isTesting ? 'STOP' : 'GO'}
        </Text>
      </TouchableOpacity>
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
  },
  speedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
  },
  speedItem: {
    alignItems: 'center',
    flex: 1,
  },
  speedLabel: {
    color: '#6b7280',
    fontSize: 16,
    marginTop: 8,
  },
  speedValue: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 4,
  },
  speedUnit: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  startButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2d3748',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  startButtonActive: {
    backgroundColor: '#3498db',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});