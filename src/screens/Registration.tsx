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
import { RegistrationData } from '../types/user';

type RegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Registration'
>;

interface Props {
  navigation: RegistrationScreenNavigationProp;
}

export const Registration: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<RegistrationData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male',
  });

  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

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
      // TODO: Implement actual registration logic
      await new Promise(resolve => setTimeout(() => resolve(undefined), 2000)); // Simulate API call
      Alert.alert('Success', 'Registration successful!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us for convenient teleconsultation services
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
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <CustomButton
              title="Sign In"
              onPress={() => navigation.navigate('Login')}
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
});
