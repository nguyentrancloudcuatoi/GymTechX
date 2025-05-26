import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState('overview-tab');

  const tabContent = {
    'overview-tab': (
      <View style={styles.tabContent}>
        <View style={styles.statCard}>
          <Text style={styles.stat}>🏋️ Workouts</Text>
          <Text style={styles.statValue}>55</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.stat}>⏱️ Total Time</Text>
          <Text style={styles.statValue}>42.5 h</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.stat}>🔥 Total Kcal</Text>
          <Text style={styles.statValue}>25,500</Text>
        </View>
      </View>
    ),
    'history-tab': (
      <View style={styles.tabContent}>
        {['Jul 25: Leg Day - 410 Kcal', 'Jul 23: Chest - 380 Kcal', 'Jul 22: Back - 450 Kcal'].map((item, index) => (
          <View key={index} style={styles.historyCard}>
            <Text style={styles.historyItem}>🗓️ {item}</Text>
          </View>
        ))}
      </View>
    ),
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Progress Tracking</Text>
      <View style={styles.tabButtons}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'overview-tab' && styles.tabButtonActive]}
          onPress={() => setActiveTab('overview-tab')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'overview-tab' && styles.tabButtonTextActive]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history-tab' && styles.tabButtonActive]}
          onPress={() => setActiveTab('history-tab')}
        >
          <Text style={[styles.tabButtonText, activeTab === 'history-tab' && styles.tabButtonTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {tabContent[activeTab]}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  header: {
    fontSize: 30,
    color: '#212529',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  tabButtons: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#0d6efd',
  },
  tabButtonText: {
    color: '#6c757d',
    fontWeight: '600',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    gap: 15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stat: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    color: '#212529',
    fontWeight: 'bold',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    fontSize: 16,
    color: '#212529',
  },
});

export default ProgressScreen;
