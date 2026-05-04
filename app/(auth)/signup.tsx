import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';

export default function SignupScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.signup({
        firstName,
        lastName,
        email,
        password,
        department: { id: "_psVudI", title: "Computer Science" }, // Default department
      });

      // Success - go to login
      router.replace('/(auth)/login');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.surface} elevation={2}>
          <Text variant="headlineMedium" style={styles.title}>Create Account</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Join us today</Text>

          {error ? (
            <HelperText type="error" visible={true} style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          <View style={styles.row}>
            <TextInput
              label="First Name"
              value={formData.firstName}
              onChangeText={(val) => handleChange('firstName', val)}
              mode="outlined"
              style={[styles.input, { flex: 1, marginRight: 8 }]}
            />
            <TextInput
              label="Last Name"
              value={formData.lastName}
              onChangeText={(val) => handleChange('lastName', val)}
              mode="outlined"
              style={[styles.input, { flex: 1 }]}
            />
          </View>

          <TextInput
            label="Email"
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            value={formData.password}
            onChangeText={(val) => handleChange('password', val)}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <TextInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(val) => handleChange('confirmPassword', val)}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock-check" />}
          />

          <Button
            mode="contained"
            onPress={handleSignup}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Sign Up
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <Text variant="bodyMedium" style={{ color: colors.primary, fontWeight: 'bold' }}>
                Login
              </Text>
            </Link>
          </View>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 25,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 10,
  }
});
