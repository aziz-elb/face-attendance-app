import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Appbar, Button, Card, Text, TextInput, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';

export default function JustifyAbsenceScreen() {
  const { attendanceId, date } = useLocalSearchParams();
  const { colors } = useTheme();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      if (Platform.OS === "web") {
        alert("Error: Please provide a reason for your absence");
      }
      else {
        Alert.alert('Error', 'Please provide a reason for your absence');
      }
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
          isArchived: false,

        }
      });
      if (Platform.OS === "web") {
        alert("Success: Justification submitted successfully");
      }
      else {
        Alert.alert('Success', 'Justification submitted successfully');
      }
      router.push('/(user)/attendance');
      setMessage("")
    } catch (error) {
      if (Platform.OS === "web") {
        alert("Error: Failed to submit justification");
      }
      else {
        Alert.alert('Error', 'Failed to submit justification');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Appbar.Header elevated >
        <Appbar.Action icon="arrow-left" onPress={() => router.push('/(user)/attendance')} /> 
        <Appbar.Content title="Justify Absence" titleStyle={{ fontWeight: 'bold' }} />
      </Appbar.Header>
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
          style={[styles.input, { backgroundColor: colors.surface  , marginBottom : 20}]}
        />


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
    minHeight: 150,
    textAlignVertical: 'top',
  },
  hint: {
    marginBottom: 24,
    opacity: 0.6,
  },
  button: {
    borderRadius: 28,
  }
});
