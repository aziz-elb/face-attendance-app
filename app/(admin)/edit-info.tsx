import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Surface, HelperText, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function AdminEditInfo() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: 'System Admin',
    email: 'admin@demo.com',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Admin profile updated!');
      setTimeout(() => router.replace('/(admin)/profile'), 1000);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.surface} elevation={1}>
          {success ? <HelperText type="info" style={{ color: colors.primary }}>{success}</HelperText> : null}
          
          <TextInput
            label="Full Name"
            value={formData.name}
            onChangeText={(val) => setFormData({...formData, name: val})}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Admin Email"
            value={formData.email}
            onChangeText={(val) => setFormData({...formData, email: val})}
            mode="outlined"
            style={styles.input}
          />

          <Button 
            mode="contained" 
            onPress={handleSave} 
            loading={loading} 
            style={styles.button}
          >
            Update Admin Profile
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
