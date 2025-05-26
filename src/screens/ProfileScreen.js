import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const userAvatar = 'https://via.placeholder.com/150x150.png?text=Avatar';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        {/* Settings Icon */}
        <TouchableOpacity style={styles.settingsIcon} onPress={() => alert('Đi đến trang cài đặt')}>
          <Ionicons name="settings-sharp" size={24} color="#000" />
        </TouchableOpacity>

        {/* Rest of the header content */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        </View>

        {/* Tên và @handle */}
        <Text style={styles.userName}>Thanh Nhật</Text>
        <Text style={styles.userHandle}>@ThanhNhat41 · Đã tham gia tháng Chín 2023</Text>

        {/* Thông tin thống kê cơ bản (Khoa học, Đang theo dõi, Người theo dõi) */}
        <View style={styles.userStatsContainer}>
          {/* <View style={styles.statItem}>
            <Text style={styles.statTitle}>Khoa học</Text>
            <Text style={styles.statValue}>0</Text>
          </View> */}
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Đang theo dõi</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statTitle}>Người theo dõi</Text>
            <Text style={styles.statValue}>0</Text>
          </View>
        </View>

        {/* Nút thêm bạn bè */}
        <TouchableOpacity style={styles.addFriendButton} onPress={() => alert('Thêm bạn bè')}>
          <Text style={styles.addFriendText}>+ THÊM BẠN BÈ</Text>
        </TouchableOpacity>
      </View>

      {/* Phần nội dung: Tổng quan */}
      <View style={styles.overviewContainer}>
        <Text style={styles.sectionTitle}>Tổng quan</Text>

        <View style={styles.overviewStatsWrapper}>
          {/* Mỗi khối thống kê */}
          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>0</Text>
            <Text style={styles.overviewLabel}>Ngày streak</Text>
          </View>

          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>1393</Text>
            <Text style={styles.overviewLabel}>Tổng KN</Text>
          </View>

          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>407</Text>
            <Text style={styles.overviewLabel}>Từ vựng đã học</Text>
          </View>

          <View style={styles.overviewItem}>
            <Text style={styles.overviewValue}>669</Text>
            <Text style={styles.overviewLabel}>Đây là gì?</Text>
            {/* Đặt label phù hợp cho số liệu 669 (ví dụ: 'Điểm' / 'Bài tập đã hoàn thành', tuỳ ý) */}
          </View>
        </View>
      </View>

      {/* Phần huy hiệu: Thử thách tháng */}
      {/* <View style={styles.badgeContainer}>
        <Text style={styles.badgeTitle}>Bài viết của tôi</Text>
        <TouchableOpacity onPress={() => alert('Xem tất cả huy hiệu')}>
          <Text style={styles.viewAll}>XEM TẤT CẢ</Text>
        </TouchableOpacity>
      </View> */}

      {/* Nếu có danh sách huy hiệu hoặc phần tiếp theo, hiển thị ở đây */}
      {/* <View> 
        ...
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /** Header trên cùng **/
  header: {
    backgroundColor: '#f2f2f2', // Màu nền nhạt, tuỳ chỉnh
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 50,
    position: 'relative',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  settingsIcon: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  avatarContainer: {
    marginBottom: 12,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userHandle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  userStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  addFriendButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 2, // Hiệu ứng đổ bóng nhẹ trên Android
  },
  addFriendText: {
    color: '#007bff',
    fontWeight: '600',
    fontSize: 14,
  },

  /** Phần Tổng quan **/
  overviewContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  overviewStatsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '48%',
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff9f43', // Màu nổi bật tuỳ chọn
    marginBottom: 6,
  },
  overviewLabel: {
    fontSize: 14,
    color: '#333',
  },

  /** Phần Huy hiệu **/
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  badgeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  viewAll: {
    fontSize: 14,
    color: '#007bff',
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
