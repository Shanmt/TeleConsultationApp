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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type RegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Registration'
>;

interface Props {
  navigation: RegistrationScreenNavigationProp;
}

export const Registration: React.FC<Props> = ({ navigation }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female' | 'other',
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData);
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us for seamless teleconsultation services
          </Text>
        </View>

        <View style={styles.form}>
          <CustomInput
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
            error={errors.firstName}
            leftIcon="person"
          />

          <CustomInput
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
            error={errors.lastName}
            leftIcon="person"
          />

          <CustomInput
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            error={errors.email}
            leftIcon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(text) => updateFormData('phone', text)}
            error={errors.phone}
            leftIcon="call"
            keyboardType="phone-pad"
          />

          <CustomInput
            label="Date of Birth"
            placeholder="MM/DD/YYYY"
            value={formData.dateOfBirth}
            onChangeText={(text) => updateFormData('dateOfBirth', text)}
            leftIcon="calendar"
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            error={errors.password}
            leftIcon="lock-closed"
            isPassword
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            error={errors.confirmPassword}
            leftIcon="lock-closed"
            isPassword
          />

          <CustomButton
            title={loading ? 'Creating Account...' : 'Create Account'}
            onPress={handleRegister}
            disabled={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Text
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              Sign In
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
  registerButton: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
  },
  loginText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
