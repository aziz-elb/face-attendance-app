import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { TextInput, Button, Text, useTheme, Card } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { ScrollView } from 'react-native-gesture-handler';

export default function JustifyAbsenceScreen() {
  const { attendanceId, date } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please provide a reason for your absence');
      return;
    }

    setLoading(true);
    try {
      await api.updateAttendance(attendanceId as string, {
        is_justified: true,
        justification: {
          message: message.trim(),
          file_path: "document_placeholder.pdf", // In a real app, this would be an uploaded file path
          status: 'PENDING',
          isArchived: false
        }
      });
      Alert.alert('Success', 'Justification submitted successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit justification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleMedium">Absence Date</Text>
            <Text variant="headlineSmall" style={{ color: colors.primary, fontWeight: 'bold' }}>
              {new Date(date as string).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </Card.Content>
        </Card>

        <Text variant="bodyLarge" style={styles.label}>Reason for Absence</Text>
        <TextInput
          mode="outlined"
          placeholder="Please explain why you were absent..."
          multiline
          numberOfLines={6}
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />

        <Text variant="bodySmall" style={styles.hint}>
          Note: You can attach supporting documents (medical certificates, etc.) once the file upload feature is enabled.
        </Text>

        <Button 
          mode="contained" 
          onPress={handleSubmit} 
          loading={loading}
          disabled={loading}
          style={styles.button}
          contentStyle={{ height: 48 }}
        >
          Submit Justification
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  infoCard: {
    marginBottom: 24,
    elevation: 2,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  hint: {
    marginBottom: 24,
    opacity: 0.6,
  },
  button: {
    borderRadius: 8,
  }
});
