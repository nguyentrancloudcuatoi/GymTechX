import React from 'react'; // Không cần useState, useRef, useEffect nếu chỉ hiển thị WebView
import { StyleSheet, TouchableOpacity, View, Alert, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview'; // Import WebView component
import * as Linking from 'expo-linking'; // Giữ lại Linking nếu bạn muốn tùy chọn mở ngoài

export default function CameraScreen() { // Giữ tên function là CameraScreen theo yêu cầu, dù nội dung đã thay đổi
  const navigation = useNavigation();

  // Hàm đóng WebView (giả định nó nằm trong stack và muốn quay lại màn hình trước)
  const handleCloseWebView = () => {
    console.log('[WebViewScreen] Closing WebView');
    // Sử dụng navigation.goBack() để quay lại màn hình trước trong stack
    if (navigation.canGoBack()) {
        navigation.goBack();
    } else {
        // Xử lý nếu không có màn hình nào để quay lại (ví dụ: đây là màn hình đầu tiên)
        // Có thể thoát app hoặc làm gì đó khác tùy logic ứng dụng của bạn
        Alert.alert("Thông báo", "Không thể quay lại.", [{ text: "OK" }]);
    }
  };

  // URL bạn muốn hiển thị trong WebView
  const webViewUrl = 'https://lovethefox.github.io/appgym/mobile.html';

  // --- UI Component ---
  // Component này giờ đây chỉ render WebView và nút đóng
  return (
    <SafeAreaView style={styles.container}>
      {/* Nút Đóng WebView */}
      {/* Đặt zIndex cao để nút nằm trên WebView */}
      <TouchableOpacity
        style={styles.closeWebViewButton}
        onPress={handleCloseWebView}
      >
        <Ionicons name="close-circle-outline" size={35} color="white" />
      </TouchableOpacity>

      {/* Component WebView */}
      <WebView
        source={{ uri: webViewUrl }}
        style={styles.webView}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        // Thêm các prop khác nếu cần
        // Ví dụ: xử lý lỗi tải trang
        onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error: ', nativeEvent);
            Alert.alert("Lỗi tải trang", `Không thể tải trang web: ${nativeEvent.description || 'Lỗi không xác định'}. Vui lòng kiểm tra kết nối mạng.`, [
              { text: "OK", onPress: handleCloseWebView }, // Đóng webview khi có lỗi
              { text: "Thử mở ngoài", onPress: () => { Linking.openURL(webViewUrl).catch(err => console.error('An error occurred', err)); } } // Tùy chọn mở ngoài
            ]);
        }}
        // Thêm thanh tiến trình tải trang (tùy chọn)
        // startInLoadingState={true}
        // renderLoading={() => <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}
      />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Nền đen phù hợp
  },
  webView: {
    flex: 1, // WebView chiếm toàn bộ không gian
    backgroundColor: '#000', // Nền đen cho webview
  },
  closeWebViewButton: {
    position: 'absolute',
    // Điều chỉnh vị trí trên cùng dựa trên nền tảng và khoảng trống an toàn
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 15,
    zIndex: 20, // Đảm bảo nút nằm trên WebView
    backgroundColor: 'rgba(0,0,0,0.5)', // Nền bán trong suốt
    borderRadius: 25, // Làm tròn nút
    padding: 5, // Padding cho icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Nếu bạn thêm ActivityIndicator
  // loadingIndicator: {
  //   position: 'absolute',
  //   top: '50%',
  //   left: '50%',
  //   transform: [{ translateX: -25 }, { translateY: -25 }], // Canh giữa
  //   zIndex: 15, // Dưới nút đóng nhưng trên webview
  // }
});