import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const leaderboardData = [
  { id: '1', rank: '#1 🏆', name: 'Nhật', score: '48 days' },
  { id: '2', rank: '#2 🥈', name: 'Hội', score: '45 days' },
  { id: '3', rank: '#3 🥉', name: 'Nguyên', score: '41 days' },
  { id: '4', rank: '#4', name: 'Hường (You)', score: '39 days' },
  { id: '5', rank: '#5', name: 'Mai', score: '35 days' },
];

const LeaderboardScreen = () => {
  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Leaderboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.item,
            item.name.includes('(You)') && styles.highlightedItem
          ]}>
            <Text style={styles.rank}>{item.rank}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.score}>{item.score}</Text>
          </View>
        )}
      />
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
  item: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  highlightedItem: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  rank: {
    color: '#ff9800',
    fontSize: 22,
    fontWeight: 'bold',
    width: '25%',
  },
  name: {
    fontSize: 18,
    color: '#212529',
    width: '45%',
    fontWeight: '500',
  },
  score: {
    fontSize: 16,
    color: '#6c757d',
    width: '30%',
    textAlign: 'right',
  },
});

export default LeaderboardScreen;
