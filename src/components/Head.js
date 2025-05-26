import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation = useNavigation();

  // URL của avatar, thay bằng avatar của người dùng nếu có
  const avatarUrl = 'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg';

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.headerContainer}>
        {/* Bên trái: Chữ GYMTECHAI màu xanh dương */}
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.title}>GYMTECH X</Text>
        </TouchableOpacity>

        {/* Bên phải: Avatar của người dùng */}
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingRight:15,
    paddingLeft:15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#007bff',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 123, 255, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Header;
