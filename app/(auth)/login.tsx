import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { api } from '../../lib/api';
import { User } from '../../lib/types';
import { AppTheme } from '../../lib/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user: User = await api.login(email, password);
      api.currentUser = user;
      console.log('Logged in user:', user);
      
      // Role-based navigation
      if (user.role === 'SUPER_ADMIN') {
        router.replace('/(super-admin)');
      } else if (user.role === 'ADMIN') {
        router.replace('/(admin)');
      } else {
        router.replace('/(user)');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
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
          <Text variant="headlineMedium" style={styles.title}>Welcome Back</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>Sign in to continue</Text>

          {error ? (
            <HelperText type="error" visible={true} style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
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

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Login
          </Button>

          <View style={styles.footer}>
            <Text variant="bodyMedium">Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <Text variant="bodyMedium" style={{ color: colors.primary, fontWeight: 'bold' }}>
                Sign Up
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
    backgroundColor: AppTheme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    padding: 25,
    borderRadius: 15,
    backgroundColor: AppTheme.colors.surface,
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 28,
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
