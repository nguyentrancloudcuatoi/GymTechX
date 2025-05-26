// src/screens/CommunityScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import PostCard from '../components/postCard';
import Header from '../components/Head'; // Component header của ứng dụng

// Component CreatePostHeader cho phần input tạo bài đăng
function CreatePostHeader() {
  const navigation = useNavigation();
  return (
    <View style={styles.createPostContainer}>
      <Image
        source={{
          uri:
            'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg',
        }}
        style={styles.avatar}
      />
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <Text style={styles.placeholderText}>What's on your mind</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.mediaButton}
        onPress={() => navigation.navigate('CreatePost')}
      >
        <FontAwesome name="image" size={18} color="#333" />
      </TouchableOpacity>
    </View>
  );
}

export default function CommunityScreen() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Hàm lấy dữ liệu bài đăng từ API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://gym.s4h.edu.vn/api/posts');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch posts');
      }
      const data = await response.json();
      // Giả sử API trả về mảng bài đăng
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      Alert.alert('Lỗi', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Xử lý pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header />
      {isLoading ? (
        <ActivityIndicator
          style={{ marginTop: 20 }}
          size="large"
          color="#2e86de"
        />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id || item.id} 
          renderItem={({ item }) => <PostCard post={item} />}
          ListHeaderComponent={CreatePostHeader}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  createPostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 5,
    padding: 10,
    borderRadius: 8,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    // Elevation cho Android
    elevation: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputBox: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  placeholderText: {
    color: '#777',
  },
  mediaButton: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 20,
  },
});