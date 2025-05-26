import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();

  // Các state cho form
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // Kiểm tra dữ liệu đầu vào
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Gọi API đăng ký
      const response = await fetch('https://gym.s4h.edu.vn/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          username: username.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // Đăng ký thành công
        console.log('Register success:', data);
        Alert.alert('Success', 'Registered successfully!');
        // Quay về màn hình đăng nhập hoặc chuyển sang màn hình khác
        navigation.replace('Login'); 
      } else {
        // Báo lỗi từ backend
        console.log('Register error:', data);
        Alert.alert('Register failed', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error register:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Nếu bạn muốn nút back (trên góc màn hình)
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Nút Back (nếu cần thiết) */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <View style={styles.registerBox}>
        <Text style={styles.registerTitle}>Register</Text>

        {/* Full name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#999"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            placeholderTextColor="#999"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Re-enter your password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Nút SIGN IN (thực ra là đăng ký) */}
        <TouchableOpacity 
          style={[styles.signInButton, loading && { opacity: 0.7 }]}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.signInText}>{loading ? 'Please wait...' : 'SIGN IN'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ===================== Styles =====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  registerBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  registerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    color: '#444',
    fontSize: 14,
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  signInButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginTop: 15,
    width: '60%',
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
