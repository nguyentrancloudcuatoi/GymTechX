// src/components/PostCard.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function PostCard({ post, onLike, onComment }) {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [likeCount, setLikeCount] = useState(post?.likes?.length || 0);

  useEffect(() => {
    setIsLiked(post?.isLiked || false);
    setLikeCount(post?.likes?.length || 0);
  }, [post]);

  const handleLikePress = async () => {
    try {
      setIsLiked(!isLiked);
      setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
      if (onLike) {
        await onLike();
      }
    } catch (error) {
      setIsLiked(isLiked);
      setLikeCount(post?.likes?.length || 0);
      console.error('Lỗi khi thực hiện like:', error);
    }
  };

  const handleEditPost = async () => {
    try {
      const response = await fetch(`https://gym.s4h.edu.vn/api/posts/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
        }),
      });

      if (!response.ok) {
        throw new Error('Không thể chỉnh sửa bài viết');
      }

      Alert.alert('Thành công', 'Bài viết đã được cập nhật');
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa bài viết:', error);
      Alert.alert('Lỗi', 'Không thể chỉnh sửa bài viết');
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`https://gym.s4h.edu.vn/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Không thể xóa bài viết');
      }

      Alert.alert('Thành công', 'Bài viết đã được xóa');
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      Alert.alert('Lỗi', 'Không thể xóa bài viết');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <View style={styles.card}>
      {/* Header: Avatar, Username, Subreddit và Ngày đăng */}
      <View style={styles.header}>
        <Image source={{ uri: 'https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg' }} style={styles.avatar} />
        <View style={styles.headerText}>
          <Text style={styles.subreddit}>{post.subreddit}</Text>
          {post.createdAt && (
            <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.optionsButton}
          onPress={() => {
            Alert.alert(
              'Tùy chọn bài viết',
              'Bạn muốn thực hiện thao tác gì?',
              [
                {
                  text: 'Chỉnh sửa',
                  onPress: handleEditPost
                },
                {
                  text: 'Xóa',
                  onPress: () => {
                    Alert.alert(
                      'Xác nhận xóa',
                      'Bạn có chắc chắn muốn xóa bài viết này?',
                      [
                        {
                          text: 'Hủy',
                          style: 'cancel'
                        },
                        {
                          text: 'Xóa',
                          style: 'destructive',
                          onPress: handleDeletePost
                        }
                      ]
                    );
                  },
                  style: 'destructive'
                },
                {
                  text: 'Hủy',
                  style: 'cancel'
                }
              ]
            );
          }}
        >
          <FontAwesome name="ellipsis-v" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      {/* Tiêu đề bài đăng */}
      <Text style={styles.title}>{post.title}</Text>
      {/* Nội dung bài đăng (nếu có) */}
      {post.content ? <Text style={styles.content}>{post.content}</Text> : null}

      {/* Hiển thị ảnh bài đăng */}
      {post.imageUri ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.imageUri }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
      ) : post.imageBase64s && post.imageBase64s.length > 0 ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${post.imageBase64s[0]}` }}
            style={styles.postImage}
            resizeMode="cover"
          />
        </View>
      ) : null}

      {/* Footer: Các nút tương tác */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.individualFooterItem,
            isLiked && styles.likedFooterItem
          ]}
          onPress={handleLikePress}
          activeOpacity={0.7}
        >
          <FontAwesome 
            name="heart" 
            size={20} 
            color={isLiked ? "#e74c3c" : "#CCCCCC"} 
          />
          <Text style={[
            styles.upvoteCount,
            isLiked && styles.likedText
          ]}>
            {likeCount >= 1000
              ? (likeCount / 1000).toFixed(1) + 'k'
              : likeCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.individualFooterItem}
          onPress={onComment}
          activeOpacity={0.7}
        >
          <FontAwesome name="comment" size={20} color="#CCCCCC" />
          <Text style={styles.commentCount}>
            {post.comments ? post.comments.length : 0}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.individualFooterItem}>
          <FontAwesome name="share" size={20} color="#CCCCCC" />
          <Text style={styles.shareLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    // Shadow cho iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    // Elevation cho Android
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  headerText: {
    flexDirection: 'column',
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  subreddit: {
    fontSize: 12,
    color: '#888',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 6,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  individualFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  likedFooterItem: {
    backgroundColor: '#ffe6e6',
  },
  likedText: {
    color: '#e74c3c',
  },
  upvoteCount: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  commentCount: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  shareLabel: {
    fontSize: 14,
    color: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  imageScrollView: {
    marginVertical: 10,
  },
  imageWrapper: {
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  multipleImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  optionsButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f3f5',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
