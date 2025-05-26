import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AnalysisResult() {
  const navigation = useNavigation();
  const route = useRoute();
  const { result, videoUri: initialVideoUri, exerciseType, exercise } = route.params || {};
  const videoRef = React.useRef(null);
  
  // Thêm biến kiểm tra môi trường phát triển
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Thêm state để lưu trữ video URI từ API
  const [videoUri, setVideoUri] = useState(initialVideoUri);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState('Đã hoàn thành phân tích');

  // Hàm để lấy video đã xử lý từ API
  const fetchProcessedVideo = async () => {
    if (!result) return;
    
    try {
      setLoading(true);
      
      // Kiểm tra cấu trúc của result để xác định tên file
      console.log('Result object:', JSON.stringify(result));
      
      // Kiểm tra các trường có thể chứa thông tin về video đã xử lý
      const processedFilename = result.processed_filename || result.output_video || result.output_filename;
      
      let videoUrl;
      
      if (processedFilename) {
        videoUrl = `https://caai.s4h.edu.vn/download-video-base64/${processedFilename}`;
      } else if (result.filename) {
        videoUrl = `https://caai.s4h.edu.vn/download-video-base64/processed_${result.filename}`;
      } else if (result.id || result.video_id) {
        const videoId = result.video_id || result.id;
        videoUrl = `https://caai.s4h.edu.vn/download-video-base64/${videoId}`;
      } else {
        throw new Error('Không tìm thấy thông tin video đã xử lý');
      }
      
      console.log('Đang thử tải video từ:', videoUrl);
      
      const response = await fetch(videoUrl);
      
      if (!response.ok) {
        // Nếu URL không tồn tại và đang sử dụng tiền tố, thử không dùng tiền tố
        if (videoUrl.includes('processed_') && result.filename) {
          const fallbackUrl = `https://caai.s4h.edu.vn/download-video-base64/${result.filename}`;
          console.log('URL không tồn tại, thử lại với:', fallbackUrl);
          
          const fallbackResponse = await fetch(fallbackUrl);
          if (fallbackResponse.ok) {
            const base64Data = await fallbackResponse.text();
            setVideoUri(`data:video/mp4;base64,${base64Data}`);
          } else {
            throw new Error(`Không thể tải video đã xử lý (status: ${response.status})`);
          }
        } else {
          throw new Error(`Không thể tải video đã xử lý (status: ${response.status})`);
        }
      } else {
        const base64Data = await response.text();
        setVideoUri(`data:video/mp4;base64,${base64Data}`);
      }
      
      // Cập nhật thông tin lỗi nếu có
      if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
        setErrors(result.errors);
      }
      
      // Cập nhật trạng thái nếu có
      if (result.status) {
        setStatus(result.status);
      }
      
    } catch (err) {
      console.error('Lỗi khi tải video đã xử lý:', err);
      setError('Không thể tải video đã xử lý. Đang sử dụng video gốc.');
      // Giữ lại video gốc nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchProcessedVideo();
  }, [result]);

  const handleBack = () => {
    navigation.goBack();
  };

  // Tạo biểu đồ đơn giản dựa trên điểm số
  const renderScoreChart = (score) => {
    const segments = 5;
    const filledSegments = Math.round((score / 100) * segments);
    
    return (
      <View style={styles.scoreChartContainer}>
        {Array.from({ length: segments }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.scoreSegment,
              index < filledSegments ? styles.scoreSegmentFilled : null,
            ]}
          />
        ))}
      </View>
    );
  };

  // Xác định màu sắc dựa trên điểm số
  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60';
    if (score >= 60) return '#f39c12';
    return '#e74c3c';
  };

  // Xác định biểu tượng dựa trên loại bài tập
  const getExerciseIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'squat':
        return 'human-handsdown';
      case 'pushup':
        return 'arm-flex';
      case 'plank':
        return 'human-handsup';
      case 'lunges':
        return 'run-fast';
      case 'deadlift':
        return 'weight-lifter';
      default:
        return 'dumbbell';
    }
  };

  // Lấy hướng dẫn bài tập dựa trên loại bài tập
  const getExerciseGuide = (type) => {
    const exerciseInfo = {
      'squat': 'Đứng với chân rộng bằng vai. Hạ thấp cơ thể như thể ngồi trên ghế, giữ đầu gối không vượt quá ngón chân. Giữ lưng thẳng và ngực hướng lên. Trở lại tư thế đứng bằng cách đẩy qua gót chân.',
      'plank': 'Bắt đầu ở tư thế nằm sấp, sau đó nâng cơ thể bằng lòng bàn tay và ngón chân. Giữ cơ thể thẳng từ đầu đến gót chân. Giữ cơ bụng và không để hông chùng xuống hoặc nâng quá cao.',
      'pushup': 'Bắt đầu ở tư thế plank cao. Hạ thấp cơ thể bằng cách gập khuỷu tay cho đến khi ngực gần chạm sàn. Giữ cơ thể thẳng và căng cơ bụng. Đẩy trở lại vị trí bắt đầu.',
      'lunges': 'Đứng thẳng, bước một chân về phía trước và hạ thấp cơ thể cho đến khi cả hai đầu gối tạo thành góc 90 độ. Đầu gối trước không nên vượt quá ngón chân. Đẩy qua gót chân trước để trở lại vị trí bắt đầu.',
      'deadlift': 'Đứng với chân rộng bằng vai, hơi gập đầu gối và hạ thấp hông. Giữ lưng thẳng, nắm tạ và nâng lên bằng cách đẩy hông về phía trước. Giữ tạ gần cơ thể trong suốt động tác.'
    };
    
    return exerciseInfo[type?.toLowerCase()] || 'Tập trung vào việc duy trình tư thế đúng trong suốt quá trình tập luyện. Hãy tập chậm và kiểm soát từng động tác để đạt hiệu quả tốt nhất.';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={handleBack} style={styles.navButton}>
          <Ionicons name="arrow-back" size={24} color="#2d3436" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Kết quả phân tích</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.videoContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0984e3" />
              <Text style={styles.loadingText}>Đang tải video đã xử lý...</Text>
            </View>
          ) : videoUri ? (
            <Video
              ref={videoRef}
              source={{ uri: videoUri }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
              isLooping={false}
            />
          ) : (
            <View style={styles.noVideoContainer}>
              <MaterialCommunityIcons name="video-off" size={48} color="#636e72" />
              <Text style={styles.noVideoText}>Không có video</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        <View style={styles.resultContainer}>
          <View style={styles.exerciseInfoCard}>
            <View style={styles.exerciseIconContainer}>
              <MaterialCommunityIcons
                name={getExerciseIcon(exerciseType)}
                size={32}
                color="#0984e3"
              />
            </View>
            <View style={styles.exerciseInfoContent}>
              <Text style={styles.exerciseTitle}>
                {exercise?.exerciseTitle || `Bài tập ${exerciseType || 'không xác định'}`}
              </Text>
              <Text style={styles.exerciseSubtitle}>
                {exercise?.muscleLabel || 'Phân tích tư thế'}
              </Text>
            </View>
          </View>

          {/* Thêm thông tin trạng thái và lỗi */}
          <View style={styles.statusCard}>
            <View style={styles.statusItem}>
              <View style={styles.statusIcon}>
                <MaterialCommunityIcons name="check-circle" size={24} color="#27ae60" />
              </View>
              <Text style={styles.statusText}>Trạng thái: {status}</Text>
            </View>
            
            {errors.length > 0 && (
              <View style={styles.statusItem}>
                <View style={[styles.statusIcon, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
                  <MaterialCommunityIcons name="alert-circle" size={24} color="#e74c3c" />
                </View>
                <Text style={styles.statusText}>
                  Lỗi: {errors.join(', ')}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Điểm số tổng thể</Text>
            <View style={styles.scoreRow}>
              <Text
                style={[
                  styles.scoreValue,
                  { color: getScoreColor(result?.score || 0) },
                ]}
              >
                {result?.score || 0}
              </Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            {renderScoreChart(result?.score || 0)}
          </View>

          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>Nhận xét chi tiết</Text>
            {result?.feedback?.length > 0 ? (
              <View style={styles.feedbackList}>
                {result.feedback.map((item, index) => (
                  <View key={index} style={styles.feedbackItem}>
                    <View style={styles.feedbackBullet}>
                      <Text style={styles.bulletText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.feedbackText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noFeedbackText}>
                Không có nhận xét chi tiết cho bài tập này.
              </Text>
            )}
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Thống kê</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="repeat"
                  size={24}
                  color="#0984e3"
                />
                <Text style={styles.statValue}>{result?.rep_count || 0}</Text>
                <Text style={styles.statLabel}>Số lần lặp lại</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="timer-outline"
                  size={24}
                  color="#0984e3"
                />
                <Text style={styles.statValue}>
                  {result?.duration ? `${result.duration}s` : 'N/A'}
                </Text>
                <Text style={styles.statLabel}>Thời gian</Text>
              </View>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={24}
                color="#f39c12"
              />
              <Text style={styles.tipTitle}>Hướng dẫn bài tập</Text>
            </View>
            <Text style={styles.tipText}>
              {getExerciseGuide(exerciseType)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="refresh-outline" size={24} color="#2d3436" />
          <Text style={styles.actionButtonText}>Thử lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonPrimary]}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home-outline" size={24} color="#fff" />
          <Text style={styles.actionButtonTextPrimary}>Trang chủ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
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
  navButton: {
    padding: 8,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2d3436',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  resultContainer: {
    padding: 16,
  },
  exerciseInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  exerciseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(9,132,227,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseInfoContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  exerciseSubtitle: {
    fontSize: 14,
    color: '#636e72',
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 20,
    color: '#636e72',
    marginLeft: 4,
  },
  scoreChartContainer: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f0f2f5',
    overflow: 'hidden',
    marginTop: 8,
  },
  scoreSegment: {
    flex: 1,
    height: '100%',
    marginHorizontal: 2,
    backgroundColor: '#dfe6e9',
    borderRadius: 4,
  },
  scoreSegmentFilled: {
    backgroundColor: '#0984e3',
  },
  feedbackCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 12,
  },
  feedbackList: {
    marginTop: 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  feedbackBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0984e3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  feedbackText: {
    flex: 1,
    fontSize: 16,
    color: '#2d3436',
    lineHeight: 24,
  },
  noFeedbackText: {
    fontSize: 16,
    color: '#636e72',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#636e72',
  },
  tipCard: {
    backgroundColor: 'rgba(243,156,18,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f39c12',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 15,
    color: '#2d3436',
    lineHeight: 22,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#636e72',
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  noVideoText: {
    marginTop: 12,
    fontSize: 16,
    color: '#636e72',
  },
  errorContainer: {
    padding: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 4,
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(39, 174, 96, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 15,
    color: '#2d3436',
  }
});

 