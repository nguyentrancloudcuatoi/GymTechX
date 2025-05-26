

// src/navigation/RootNavigator.js
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import các màn hình chính và auth
import MainTabNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProgressScreen from '../screens/ProgressScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VideoDisplayScreen from '../screens/VideoDisplayScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import CameraScreen from '../screens/CameraScreen';
// Xóa dòng import StreamScreen
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/SplashScreen';
import { AuthContext } from '../context/AuthContext';

// Import màn hình AnalysisResult
import AnalysisResult from '../screens/AnalysisResult';

const Stack = createStackNavigator();

function RootNavigator() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {userToken ? (
        // Nếu người dùng đã đăng nhập, hiển thị Navigator chính
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
          <Stack.Screen name="Library" component={LibraryScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="VideoDisplayScreen" component={VideoDisplayScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          {/* Xóa Stack.Screen của StreamScreen */}
          <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          <Stack.Screen name="AnalysisResult" component={AnalysisResult} />
        </>
      ) : (
        // Nếu chưa đăng nhập, hiển thị các màn hình auth
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default RootNavigator;
