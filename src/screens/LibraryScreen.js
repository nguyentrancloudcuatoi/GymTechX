// src/screens/LibraryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LibraryScreen() {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('https://gym.s4h.edu.vn/api/exercises');
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const data = await response.json();
        // console.log(data)
        // Giả sử API trả về một mảng các bài tập theo model Exercise
        setExercises(data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        Alert.alert('Error', 'Failed to load exercises');
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VideoDisplayScreen', { exercise: item })}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.exerciseImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.exerciseTitle}>{item.exerciseTitle}</Text>
        <Text style={styles.muscleLabel}>{item.muscleLabel}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4834d4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Exercise Library</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginVertical: 8,
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 130,
  },
  exerciseImage: {
    width: 110,
    height: '100%',
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  textContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 8,
    lineHeight: 24,
  },
  muscleLabel: {
    fontSize: 15,
    color: '#636e72',
    fontWeight: '500',
  },
  exerciseLevel: {
    fontSize: 14,
    color: '#4834d4',
    fontWeight: '500',
    marginTop: 4,
  }
});
