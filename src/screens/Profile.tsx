import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { User } from '../types/user';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const Profile: React.FC<Props> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Mock user data - in real app, fetch from context/API
  const user: User = {
    id: 'user-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    profileImage: 'https://example.com/profile.jpg',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  const profileMenuItems = [
    {
      id: '1',
      title: 'Personal Information',
      subtitle: 'Update your personal details',
      icon: 'person',
      onPress: () => Alert.alert('Info', 'Edit profile feature coming soon!'),
    },
    {
      id: '2',
      title: 'Medical History',
      subtitle: 'View your medical records',
      icon: 'medical',
      onPress: () => Alert.alert('Info', 'Medical history feature coming soon!'),
    },
    {
      id: '3',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      icon: 'card',
      onPress: () => Alert.alert('Info', 'Payment methods feature coming soon!'),
    },
    {
      id: '4',
      title: 'Appointment History',
      subtitle: 'View past consultations',
      icon: 'time',
      onPress: () => Alert.alert('Info', 'Appointment history feature coming soon!'),
    },
    {
      id: '5',
      title: 'Prescriptions',
      subtitle: 'Access your prescriptions',
      icon: 'medical-outline',
      onPress: () => Alert.alert('Info', 'Prescriptions feature coming soon!'),
    },
  ];

  const settingsMenuItems = [
    {
      id: '1',
      title: 'Notifications',
      subtitle: 'Manage notification preferences',
      icon: 'notifications',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
    },
    {
      id: '2',
      title: 'Dark Mode',
      subtitle: 'Toggle dark theme',
      icon: 'moon',
      type: 'switch',
      value: darkModeEnabled,
      onValueChange: setDarkModeEnabled,
    },
    {
      id: '3',
      title: 'Privacy Policy',
      subtitle: 'Read our privacy policy',
      icon: 'shield-checkmark',
      type: 'button',
      onPress: () => Alert.alert('Info', 'Privacy policy feature coming soon!'),
    },
    {
      id: '4',
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      icon: 'document-text',
      type: 'button',
      onPress: () => Alert.alert('Info', 'Terms of service feature coming soon!'),
    },
    {
      id: '5',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle',
      type: 'button',
      onPress: () => navigation.navigate('ContactUs'),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Success', 'Logged out successfully');
            // TODO: Implement actual logout logic
          }
        },
      ]
    );
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          <Ionicons name="person" size={40} color={theme.colors.primary} />
        </View>
        <TouchableOpacity style={styles.editImageButton}>
          <Ionicons name="camera" size={16} color={theme.colors.background} />
        </TouchableOpacity>
      </View>
      <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
      <Text style={styles.userEmail}>{user.email}</Text>
      <Text style={styles.userPhone}>{user.phone}</Text>
    </View>
  );

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.menuContent}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
        </View>
      </View>
      {item.type === 'switch' ? (
        <Switch
          value={item.value}
          onValueChange={item.onValueChange}
          trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          thumbColor={theme.colors.background}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => Alert.alert('Info', 'Edit profile feature coming soon!')}
          >
            <Ionicons name="create" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {renderProfileHeader()}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.menuContainer}>
            {profileMenuItems.map(renderMenuItem)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuContainer}>
            {settingsMenuItems.map(renderMenuItem)}
          </View>
        </View>

        <View style={styles.section}>
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  editButton: {
    padding: theme.spacing.xs,
  },
  profileHeader: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  userName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  userPhone: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  menuContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  menuSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
  footer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  versionText: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
});
