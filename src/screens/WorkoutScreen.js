import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';

const WorkoutScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Text style={styles.header}>Workout Screen</Text>
      <View style={styles.cameraView}>
        <Image
          source={{ uri: 'https://example.com/squat_image.jpg' }} // Update with your image source
          style={styles.cameraFeedImage}
        />
      </View>

      <Text style={styles.exerciseTitle}>Deep Squat Hold</Text>
      <Text style={styles.aiFeedback}>⚠️ Knees behind toes. Good!</Text>

      <View style={styles.stats}>
        <Text>Reps: 8</Text>
        <Text>Time: 00:45</Text>
        <Text>Kcal Est: 15</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>⏹️ Stop Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#212529',
  },
  header: {
    fontSize: 30,
    color: '#f8f9fa',
    marginBottom: 20,
  },
  cameraView: {
    width: '100%',
    height: 300,
    backgroundColor: 'black',
  },
  cameraFeedImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  exerciseTitle: {
    fontSize: 24,
    color: '#fff',
    marginTop: 20,
  },
  aiFeedback: {
    color: '#ffc107',
    marginTop: 10,
  },
  stats: {
    marginTop: 20,
    color: '#f8f9fa',
  },
  button: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default WorkoutScreen;
