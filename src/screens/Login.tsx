import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export const Login: React.FC<Props> = ({ navigation }) => {
  const { signIn, resetPassword } = useAuth();
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Partial<typeof credentials>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof credentials> = {};

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
      await signIn(credentials.email, credentials.password);
      // Navigation will be handled by AuthContext when user state changes
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!credentials.email) {
      Alert.alert('Error', 'Please enter your email address first.');
      return;
    }

    try {
      await resetPassword(credentials.email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send reset email.');
    }
  };

  const updateCredentials = (field: keyof typeof credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.header}>
          <View style={styles.logoBanner}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to access your TeleClinic365 account
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

          <Text
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
          >
            Forgot Password?
          </Text>

          <CustomButton
            title={loading ? 'Signing In...' : 'Sign In'}
            onPress={handleLogin}
            disabled={loading}
            style={styles.loginButton}
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Text
              style={styles.registerLink}
              onPress={() => navigation.navigate('Registration')}
            >
              Sign Up
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2, // Add extra bottom padding to prevent overlap
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
  },
  logoBanner: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  logoImage: {
    width: 280,
    height: 80,
    maxWidth: '90%',
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
  forgotPassword: {
    ...theme.typography.body,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  registerLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
