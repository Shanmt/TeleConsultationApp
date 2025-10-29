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
import { useAuth } from '../contexts/AuthContext';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Profile'
>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

export const Profile: React.FC<Props> = ({ navigation }) => {
  const { user, userProfile, signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
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
      onPress: () => Alert.alert('Info', 'Privacy policy feature coming soon!'),
    },
    {
      id: '4',
      title: 'Terms of Service',
      subtitle: 'Read our terms of service',
      icon: 'document-text',
      onPress: () => Alert.alert('Info', 'Terms of service feature coming soon!'),
    },
    {
      id: '5',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      icon: 'help-circle',
      onPress: () => navigation.navigate('ContactUs'),
    },
  ];

  const renderMenuItem = (item: any) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
      disabled={item.type === 'switch'}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuItemIcon}>
          <Ionicons name={item.icon as any} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.menuItemContent}>
          <Text style={styles.menuItemTitle}>{item.title}</Text>
          <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Account</Text>
          <TouchableOpacity onPress={() => Alert.alert('Info', 'Edit profile feature coming soon!')}>
            <Ionicons name="create" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color={theme.colors.primary} />
            </View>
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color={theme.colors.background} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>
            {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : user?.displayName || user?.email || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {userProfile?.phone && (
            <Text style={styles.userPhone}>{userProfile.phone}</Text>
          )}
        </View>

        {/* Menu Sections */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {profileMenuItems.map(renderMenuItem)}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsMenuItems.map(renderMenuItem)}
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutSection}>
          <CustomButton
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            style={styles.signOutButton}
          />
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  profileSection: {
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
    marginBottom: theme.spacing.xs,
  },
  menuSection: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
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
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  menuItemSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  signOutSection: {
    padding: theme.spacing.lg,
  },
  signOutButton: {
    borderColor: theme.colors.error,
  },
});
