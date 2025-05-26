import React, { useState, useContext } from 'react';
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
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext); // Lấy hàm login từ AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://gym.s4h.edu.vn/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Login success:', data);
        // Giả sử backend trả về token trong data.token
        await login(data.token);
        // Reset Navigator để chuyển sang giao diện chính
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      } else {
        Alert.alert('Login failed', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error login:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Splash');
    }
  };

  const handleSignUpLink = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {navigation.canGoBack() && (
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
      )}
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>LOGIN</Text>
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
        <TouchableOpacity style={styles.forgotButton} onPress={() => Alert.alert('Forgot Password', 'Not implemented.')}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.signInButton, loading && { opacity: 0.7 }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.signInText}>{loading ? 'Please wait...' : 'SIGN IN'}</Text>
        </TouchableOpacity>
        <View style={styles.signUpRow}>
          <Text style={styles.signUpQuestion}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleSignUpLink}>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

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
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
  },
  backText: {
    fontSize: 24,
    color: '#000',
  },
  loginBox: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  loginTitle: {
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 15,
  },
  forgotText: {
    fontSize: 14,
    color: '#007AFF',
  },
  signInButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 15,
    width: '60%',
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpQuestion: {
    fontSize: 14,
    color: '#333',
    marginRight: 5,
  },
  signUpLink: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
