import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { TextInput, Button, Surface, HelperText, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';

export default function SuperAdminChangePassword() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = api.currentUser;
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    if (!user) return;

    if (formData.newPassword !== formData.confirmPassword) {
      if(Platform.OS == "web"){
        alert('Error\nNew passwords do not match');
        return;
      }
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

 
    setLoading(true);
    try {
      // In a real app, you'd verify currentPassword first. 
      if(user.password !== formData.currentPassword){
        if(Platform.OS == "web"){
          alert('Error\nIncorrect current password');
          return;
        }
        Alert.alert('Error', 'Incorrect current password');
        return;
      }
      // For this implementation, we directly update.
      const updatedUser = await api.updateUser(user.id, {
        password: formData.newPassword
      });
      
      api.currentUser = updatedUser;
      
      setSuccess('Super Admin password changed!');
      setTimeout(() => router.replace('/(super-admin)/profile'), 1000);
    } catch (error: any) {
      if(Platform.OS == "web"){
        alert('Error\n' + error.message || 'Failed to change password');
        return;
      }
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.surface} elevation={1}>
          {success ? <HelperText type="info" style={{ color: colors.primary }}>{success}</HelperText> : null}
          
          <TextInput
            label="Current Password"
            value={formData.currentPassword}
            onChangeText={(val) => setFormData({...formData, currentPassword: val})}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="New Super Admin Password"
            value={formData.newPassword}
            onChangeText={(val) => setFormData({...formData, newPassword: val})}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <TextInput
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChangeText={(val) => setFormData({...formData, confirmPassword: val})}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button 
            mode="contained" 
            onPress={handleUpdate} 
            loading={loading} 
            style={styles.button}
            disabled={loading}
          >
            Confirm Password Change
          </Button>
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  }
});
