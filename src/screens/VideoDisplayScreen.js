import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function VideoDisplayScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [playing, setPlaying] = useState(true);
  const exercise = route.params?.exercise;

  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(exercise?.videoUri);

  useEffect(() => {
    if (!exercise || !videoId) {
      Alert.alert('Thông báo', 'Không tìm thấy video bài tập', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [exercise, videoId, navigation]);

  if (!exercise || !videoId) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0984e3" />
        <Text style={styles.processingText}>Đang tải video...</Text>
      </View>
    );
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpload = async () => {
    try {
      // Check if we're running in development mode
      const isDev = process.env.NODE_ENV === 'development' || __DEV__;
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.5, // Giảm chất lượng để giảm kích thước file
        videoMaxDuration: 30, // Giới hạn thời lượng video
      });

      if (!result.canceled) {
        // Hiển thị thông báo đang xử lý
        Alert.alert('Thông báo', 'Đang xử lý video...');
        
        // Xác định loại bài tập dựa vào tên bài tập hiện tại
        let exerciseType = 'squat'; // Mặc định
        
        if (exercise && exercise.exerciseTitle) {
          const exerciseTitle = exercise.exerciseTitle.toLowerCase();
          if (exerciseTitle.includes('squat')) {
            exerciseType = 'squat';
          } else if (exerciseTitle.includes('plank')) {
            exerciseType = 'plank';
          } else if (exerciseTitle.includes('pushup') || exerciseTitle.includes('chống đẩy')) {
            exerciseType = 'pushup';
          } else if (exerciseTitle.includes('lunge')) {
            exerciseType = 'lunges';
          }
        }
        
        // Chuẩn bị dữ liệu
        const uri = result.assets[0].uri;
        
        // Trong môi trường phát triển, sử dụng dữ liệu mẫu thay vì gọi API
        if (isDev) {
          console.log('Đang chạy trong môi trường phát triển, sử dụng dữ liệu mẫu');
          
          // Giả lập thời gian xử lý
          setTimeout(() => {
            // Dữ liệu mẫu cho kết quả phân tích
            const mockData = {
              exercise_type: exerciseType,
              score: 85,
              feedback: [
                "Tư thế tốt, giữ lưng thẳng",
                "Cần hạ thấp hơn khi squat",
                "Giữ đầu gối không vượt quá ngón chân"
              ],
              rep_count: 8,
              timestamp: new Date().toISOString()
            };
            
            // Hiển thị kết quả phân tích
            Alert.alert(
              'Phân tích hoàn tất',
              'Video của bạn đã được phân tích thành công!',
              [
                {
                  text: 'Xem kết quả',
                  onPress: () => navigation.navigate('AnalysisResult', { 
                    result: mockData,
                    videoUri: uri,
                    exerciseType: exerciseType,
                    exercise: exercise
                  }),
                },
              ]
            );
          }, 2000);
          
          return;
        }
        
        // Nếu không phải môi trường phát triển, thử gọi API thật
        try {
          // Chuẩn bị dữ liệu để tải lên
          const fileType = uri.split('.').pop();
          const formData = new FormData();
          formData.append('video', {
            uri: uri,
            name: `${exerciseType}_${Date.now()}.${fileType}`,
            type: `video/${fileType}`,
          });
          formData.append('exercise_type', exerciseType);
          
          console.log('Đang tải lên video:', uri);
          console.log('Loại bài tập:', exerciseType);
          
          // Gửi video lên API
          const response = await fetch('https://caai.s4h.edu.vn/upload-video', {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 30000 // 30 giây timeout
          });
          
          if (!response.ok) {
            throw new Error(`Lỗi máy chủ: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Kết quả phân tích:', data);
          
          // Hiển thị kết quả phân tích
          Alert.alert(
            'Phân tích hoàn tất',
            'Video của bạn đã được phân tích thành công!',
            [
              {
                text: 'Xem kết quả',
                onPress: () => navigation.navigate('AnalysisResult', { 
                  result: data,
                  videoUri: uri,
                  exerciseType: exerciseType,
                  exercise: exercise
                }),
              },
            ]
          );
        } catch (apiError) {
          console.error('Lỗi API:', apiError);
          
          // Sử dụng dữ liệu mẫu khi API thất bại
          Alert.alert(
            'Thông báo',
            'Không thể kết nối đến máy chủ. Sử dụng chế độ demo.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Dữ liệu mẫu cho kết quả phân tích
                  const mockData = {
                    exercise_type: exerciseType,
                    score: 78,
                    feedback: [
                      "Tư thế cần cải thiện",
                      "Giữ lưng thẳng khi thực hiện động tác",
                      "Nhịp thở đều đặn"
                    ],
                    rep_count: 6,
                    timestamp: new Date().toISOString()
                  };
                  
                  navigation.navigate('AnalysisResult', { 
                    result: mockData,
                    videoUri: uri,
                    exerciseType: exerciseType,
                    exercise: exercise
                  });
                }
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải lên video:', error);
      Alert.alert('Lỗi', `Không thể xử lý video: ${error.message}`);
    }
  };

  const handleReco = () => {
    // Xác định loại bài tập dựa vào tên bài tập hiện tại
    let exerciseType = 'squat'; // Mặc định
    
    if (exercise && exercise.exerciseTitle) {
      const exerciseTitle = exercise.exerciseTitle.toLowerCase();
      if (exerciseTitle.includes('squat')) {
        exerciseType = 'squat';
      } else if (exerciseTitle.includes('plank')) {
        exerciseType = 'plank';
      } else if (exerciseTitle.includes('pushup') || exerciseTitle.includes('chống đẩy')) {
        exerciseType = 'pushup';
      } else if (exerciseTitle.includes('lunge')) {
        exerciseType = 'lunges';
      }
    }
    
    // Thay đổi từ StreamScreen sang Camera
    navigation.navigate('Camera', { 
      exercise: exercise,
      exerciseType: exerciseType
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleBack} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#2d3436" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chi tiết bài tập</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.videoWrapper}>
          <YoutubePlayer
            height={220}
            play={playing}
            videoId={videoId}
            onChangeState={(state) => {
              if (state === 'ended') setPlaying(false);
            }}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.exerciseTitle}>{exercise.exerciseTitle}</Text>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <MaterialCommunityIcons
                name="arm-flex-outline"
                size={24}
                color="#0984e3"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.subInfoText}>{exercise.muscleLabel}</Text>
            </View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{exercise.level}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kỹ thuật thực hiện</Text>
            <View style={styles.bulletContainer}>
              {exercise.techniqueSummary?.map((point, index) => (
                <View key={index} style={styles.bulletPoint}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tìm hiểu thêm</Text>
            <View style={styles.learnMoreContainer}>
              {exercise.learnMore?.images?.[0] ? (
                <Image
                  source={{ uri: exercise.learnMore.images[0].imageUri }}
                  style={styles.learnMoreImage}
                />
              ) : (
                <View style={[styles.learnMoreImage, { backgroundColor: '#dfe6e9' }]} />
              )}
              <View style={styles.learnMoreContent}>
                <Text style={styles.learnMoreText}>
                  {exercise.learnMore?.title || 'Xem thêm...'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Các bước thực hiện</Text>
            <View style={styles.stepsContainer}>
              {exercise.execution?.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <Text style={styles.stepNumber}>{index + 1}</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleUpload}>
          <Ionicons name="cloud-upload-outline" size={24} color="#2d3436" />
          <Text style={styles.actionButtonText}>Tải lên</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={handleReco}
        >
          <Ionicons name="videocam-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonTextPrimary}>Ghi hình</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  processingText: {
    color: '#2d3436',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3436',
    letterSpacing: 0.5,
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    elevation: 4,
    marginBottom: 12,
  },
  infoContainer: {
    padding: 12,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
    letterSpacing: 0.25,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9,132,227,0.1)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(9,132,227,0.2)',
  },
  subInfoText: {
    fontSize: 16,
    color: '#0984e3',
    fontWeight: '600',
    letterSpacing: 0.25,
  },
  levelBadge: {
    backgroundColor: '#0984e3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#0984e3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  levelText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 12,
    letterSpacing: 0.25,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 18,
    color: '#0984e3',
    marginRight: 8,
    marginTop: -4,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  learnMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(9,132,227,0.05)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(9,132,227,0.1)',
  },
  learnMoreImage: {
    width: 100,
    height: 75,
    borderRadius: 8,
  },
  learnMoreContent: {
    flex: 1,
    padding: 12,
  },
  learnMoreText: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: '700',
    backgroundColor: '#0984e3',
    color: '#ffffff',
    elevation: 2,
    shadowColor: '#0984e3',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  actionButtonsContainer: {
    padding: 12,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  actionButtonPrimary: {
    backgroundColor: '#0984e3',
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#0984e3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#2d3436',
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.25,
  },
  actionButtonTextPrimary: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.25,
  },
});