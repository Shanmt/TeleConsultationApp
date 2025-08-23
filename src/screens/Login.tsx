import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { LoginCredentials } from '../types/user';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const Login: React.FC<Props> = ({ navigation }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual login logic
      await new Promise(resolve => setTimeout(() => resolve(undefined), 2000)); // Simulate API call
      
      // For demo purposes, navigate to main app
      // In real app, you would check authentication status
      Alert.alert('Success', 'Login successful!', [
        { text: 'OK', onPress: () => {
          // Navigate to main app - this would be handled by auth context
          console.log('Navigate to main app');
        }},
      ]);
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const updateCredentials = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to access your teleconsultation account
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="Email"
            placeholder="Enter your email"
            value={credentials.email}
            onChangeText={(text) => updateCredentials('email', text)}
            error={errors.email}
            leftIcon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={credentials.password}
            onChangeText={(text) => updateCredentials('password', text)}
            error={errors.password}
            leftIcon="lock-closed"
            isPassword
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.forgotPasswordContainer}>
            <CustomButton
              title="Forgot Password?"
              onPress={() => Alert.alert('Info', 'Forgot password functionality coming soon!')}
              variant="outline"
              size="small"
            />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <CustomButton
              title="Sign Up"
              onPress={() => navigation.navigate('Registration')}
              variant="outline"
              size="small"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  registerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
