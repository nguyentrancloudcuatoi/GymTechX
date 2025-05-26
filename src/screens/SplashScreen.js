// src/screens/SplashScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleSignup = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {/* Vòng tròn lớn */}
      <View style={styles.circle} />

      {/* Logo text */}
      <Text style={styles.brandText}>GYMTECH X</Text>

      {/* Thanh 3 dấu chấm ở giữa */}
      <View style={styles.dotContainer}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>

      {/* Nút LOGIN bên trái, SIGNUP bên phải */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupText}>SIGNUP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CIRCLE_SIZE = 200;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Nền trắng
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  brandText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007AFF',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 30,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  loginButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  signupButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 16,
    color: '#333',
  },
  signupText: {
    fontSize: 16,
    color: '#fff',
  },
});
