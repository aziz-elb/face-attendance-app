import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Surface, HelperText, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';

export default function SuperAdminEditInfo() {
  const { colors } = useTheme();
  const router = useRouter();
  const user = api.currentUser;
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await api.updateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      
      // Update global currentUser
      api.currentUser = updatedUser;
      
      setSuccess('Super Admin profile updated!');
      setTimeout(() => router.replace('/(super-admin)/profile'), 1000);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
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
            label="First Name"
            value={formData.firstName}
            onChangeText={(val) => setFormData({...formData, firstName: val})}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(val) => setFormData({...formData, lastName: val})}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Super Admin Email"
            value={formData.email}
            onChangeText={(val) => setFormData({...formData, email: val})}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
          />

          <Button 
            mode="contained" 
            onPress={handleSave} 
            loading={loading} 
            style={styles.button}
            disabled={loading}
          >
            Update Super Admin Profile
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
