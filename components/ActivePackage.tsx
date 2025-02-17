import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export function ActivePackage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paket Aktif</Text>
      <View style={styles.packageInfo}>
        <AnimatedCircularProgress
          size={120}
          width={12}
          fill={75}
          tintColor="#3498db"
          backgroundColor="#2d3748"
          rotation={0}
        >
          {(fill) => (
            <View style={styles.progressContent}>
              <Text style={styles.progressText}>21h</Text>
            </View>
          )}
        </AnimatedCircularProgress>
        <View style={styles.details}>
          <Text style={styles.packageName}>Paket 28 hari</Text>
          <Text style={styles.speed}>30Mbps</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#2d3748',
    margin: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressContent: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  details: {
    marginLeft: 24,
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  speed: {
    fontSize: 18,
    color: '#3498db',
  },
});