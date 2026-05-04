import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Surface, HelperText, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function AdminChangePassword() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleUpdate = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Admin password changed!');
      setTimeout(() => router.replace('/(admin)/profile'), 1000);
    }, 1000);
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
            label="New Admin Password"
            value={formData.newPassword}
            onChangeText={(val) => setFormData({...formData, newPassword: val})}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />

          <Button 
            mode="contained" 
            onPress={handleUpdate} 
            loading={loading} 
            style={styles.button}
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
