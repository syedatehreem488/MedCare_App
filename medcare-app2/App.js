// App.js — MedCare welcome screen.
// When the screen opens, it calls our backend (/api/welcome).
// The backend reads numbers from MySQL and sends them back as JSON.

import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { API_URL } from './config';

export default function App() {
  const [data, setData] = useState(null);       // what the server sends back
  const [loading, setLoading] = useState(true); // are we still waiting?
  const [error, setError] = useState('');       // error message, if any

  // Ask the backend for the welcome data
  const loadWelcome = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/api/welcome`);
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || 'Server error');
      setData(json);
    } catch (err) {
      setError('Could not reach the server. Make sure the backend is running and the IP in config.js is correct.');
    } finally {
      setLoading(false);
    }
  };

  // Run loadWelcome once, when the screen first opens
  useEffect(() => {
    loadWelcome();
  }, []);

  const comingSoon = () => Alert.alert('Coming soon', 'This screen will be added next.');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />

      {/* Logo + title */}
      <View style={styles.logo}>
        <Text style={styles.logoText}>+</Text>
      </View>
      <Text style={styles.title}>Welcome to MedCare</Text>
      <Text style={styles.tagline}>
        {data ? data.tagline : 'Your medicine reminder and caregiver helper.'}
      </Text>

      {/* Database status card */}
      <View style={styles.card}>
        {loading && <ActivityIndicator size="large" color="#1F6F78" />}

        {!loading && error !== '' && (
          <>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadWelcome}>
              <Text style={styles.retryText}>Try again</Text>
            </TouchableOpacity>
          </>
        )}

        {!loading && data && (
          <>
            <Text style={styles.connected}>● Connected to database</Text>
            <View style={styles.statsRow}>
              <Stat number={data.stats.patients} label="Patients" />
              <Stat number={data.stats.caregivers} label="Caregivers" />
              <Stat number={data.stats.medicines} label="Medicines" />
            </View>
          </>
        )}
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={comingSoon}>
        <Text style={styles.primaryText}>Get Started</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={comingSoon}>
        <Text style={styles.secondaryText}>I already have an account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// A small reusable box that shows one number and its label
function Stat({ number, label }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, backgroundColor: '#F4F9F9', alignItems: 'center',
    justifyContent: 'center', padding: 24, paddingTop: 60,
  },
  logo: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: '#1F6F78',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  logoText: { color: '#fff', fontSize: 52, fontWeight: 'bold', marginTop: -4 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#12343B', textAlign: 'center' },
  tagline: { fontSize: 17, color: '#4A6670', textAlign: 'center', marginTop: 8, marginBottom: 28 },
  card: {
    width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 20,
    alignItems: 'center', marginBottom: 32, minHeight: 120, justifyContent: 'center',
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8,
  },
  connected: { color: '#2E8B57', fontSize: 16, fontWeight: '600', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#1F6F78' },
  statLabel: { fontSize: 14, color: '#4A6670', marginTop: 2 },
  errorText: { color: '#B23A48', fontSize: 15, textAlign: 'center', marginBottom: 12 },
  retryButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#FCE8EA' },
  retryText: { color: '#B23A48', fontWeight: '600' },
  primaryButton: {
    width: '100%', backgroundColor: '#1F6F78', paddingVertical: 16,
    borderRadius: 12, alignItems: 'center', marginBottom: 12,
  },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: {
    width: '100%', paddingVertical: 16, borderRadius: 12, alignItems: 'center',
    borderWidth: 2, borderColor: '#1F6F78',
  },
  secondaryText: { color: '#1F6F78', fontSize: 17, fontWeight: '600' },
  });