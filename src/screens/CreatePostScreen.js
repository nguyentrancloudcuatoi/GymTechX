// src/screens/CreatePostScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function CreatePostScreen({ navigation }) {
  const [postText, setPostText] = useState('');        // Tiêu đề bài viết
  const [postContent, setPostContent] = useState('');    // Nội dung chi tiết
  const [isPosting, setIsPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Lưu ảnh đã chọn

  // Yêu cầu quyền truy cập thư viện ảnh
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Quyền bị từ chối', 'Ứng dụng cần quyền truy cập thư viện ảnh!');
        }
      }
    })();
  }, []);

  // Hàm chọn ảnh (không crop)
  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        base64: true,
        quality: 0.5,
      });
      
      if (!result.canceled) {  // Thay đổi từ cancelled sang canceled
        setSelectedImage(result);
      }
    } catch (error) {
      console.error('Lỗi chọn ảnh:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh');
    }
  };

  const handlePost = async () => {
    if (postText.trim() === '' || postContent.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề và nội dung bài viết');
      return;
    }

    // Kiểm tra và lấy base64 string từ ảnh đã chọn
    let imageBase64 = null;
    if (selectedImage && selectedImage.assets && selectedImage.assets[0]) {
      imageBase64 = selectedImage.assets[0].base64;
    }

    const postData = {
      title: postText.length > 30 ? postText.substring(0, 30) + '...' : postText,
      content: postContent,
      imageBase64: imageBase64, // Gửi dưới dạng string base64
    };

    console.log('Đang gửi dữ liệu:', { ...postData, imageBase64: imageBase64 ? 'có ảnh' : 'không có ảnh' });
    
    setIsPosting(true);
    try {
      const response = await fetch('https://gym.s4h.edu.vn/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Có lỗi khi đăng bài');
      }

      const data = await response.json();
      console.log('Bài viết đã được tạo:', data);
      Alert.alert('Thành công', 'Bài viết của bạn đã được đăng');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      Alert.alert('Đăng bài thất bại', error.message);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tạo bài viết</Text>
        <TouchableOpacity onPress={handlePost} disabled={isPosting}>
          <Text style={styles.headerPostButton}>
            {isPosting ? 'ĐANG ĐĂNG...' : 'ĐĂNG'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin người dùng */}
      <View style={styles.userInfoRow}>
        <Image
          source={{ uri: 'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg' }}
          style={styles.avatar}
        />
        <View style={styles.userNamePrivacy}>
          <Text style={styles.userName}>Thanh Nhật</Text>
        </View>
      </View>

      {/* Ô nhập tiêu đề */}
      <TextInput
        style={styles.postInput}
        placeholder="Bạn đang nghĩ gì?"
        placeholderTextColor="#999"
        multiline
        onChangeText={setPostText}
        value={postText}
      />

      {/* Ô nhập nội dung chi tiết */}
      <View style={styles.contentBox}>
        <TextInput
          style={styles.contentInput}
          placeholder="Nội dung chi tiết..."
          placeholderTextColor="#999"
          multiline
          onChangeText={setPostContent}
          value={postContent}
        />
      </View>

      {/* Hiển thị preview ảnh nếu đã chọn */}
      {selectedImage && selectedImage.assets && selectedImage.assets[0] && (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: selectedImage.assets[0].uri }}
            style={styles.imagePreview}
          />
        </View>
      )}

      {/* Tùy chọn bài đăng */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionRow} onPress={handleSelectImage}>
          <FontAwesome name="picture-o" size={22} color="#2e86de" style={{ marginRight: 8 }} />
          <Text style={styles.optionText}>Ảnh/video</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1D21',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerPostButton: {
    color: '#2e86de',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userNamePrivacy: {
    flexDirection: 'column',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  postInput: {
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 60,
  },
  contentBox: {
    backgroundColor: '#2A2B2F',
    marginHorizontal: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  contentInput: {
    color: '#fff',
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    backgroundColor: '#2a2b2f',
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginHorizontal: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
});
