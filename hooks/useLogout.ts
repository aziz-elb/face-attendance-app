import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { api } from '../lib/api';

export const useLogout = () => {
  const logout = () => {
    const performLogout = () => {
      api.currentUser = null;
      router.replace('/(auth)/login');
    };

    if (Platform.OS === "android") {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: performLogout }
      ]);
    } else {
      performLogout();
    }
  };

  return logout;
};
