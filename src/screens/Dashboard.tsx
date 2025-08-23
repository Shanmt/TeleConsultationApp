import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

export const Dashboard: React.FC<Props> = ({ navigation }) => {
  const upcomingAppointments = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      date: '2024-01-15',
      time: '10:00 AM',
      type: 'Video Consultation',
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      date: '2024-01-18',
      time: '2:30 PM',
      type: 'Audio Consultation',
    },
  ];

  const quickActions = [
    {
      id: '1',
      title: 'Book Appointment',
      icon: 'calendar',
      onPress: () => navigation.navigate('BookAppointment'),
      color: theme.colors.primary,
    },
    {
      id: '2',
      title: 'View History',
      icon: 'time',
      onPress: () => Alert.alert('Info', 'Appointment history coming soon!'),
      color: theme.colors.info,
    },
    {
      id: '3',
      title: 'Contact Support',
      icon: 'help-circle',
      onPress: () => navigation.navigate('ContactUs'),
      color: theme.colors.warning,
    },
    {
      id: '4',
      title: 'Profile',
      icon: 'person',
      onPress: () => navigation.navigate('Profile'),
      color: theme.colors.success,
    },
  ];

  const renderQuickAction = (action: typeof quickActions[0]) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickActionCard, { borderLeftColor: action.color }]}
      onPress={action.onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
        <Ionicons name={action.icon as any} size={24} color="white" />
      </View>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
      <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderAppointmentCard = (appointment: typeof upcomingAppointments[0]) => (
    <View key={appointment.id} style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.specialization}>{appointment.specialization}</Text>
        </View>
        <View style={styles.appointmentType}>
          <Ionicons 
            name={appointment.type.includes('Video') ? 'videocam' : 'call'} 
            size={16} 
            color={theme.colors.primary} 
          />
          <Text style={styles.appointmentTypeText}>{appointment.type}</Text>
        </View>
      </View>
      <View style={styles.appointmentDetails}>
        <View style={styles.appointmentInfo}>
          <Ionicons name="calendar" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.appointmentText}>{appointment.date}</Text>
        </View>
        <View style={styles.appointmentInfo}>
          <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.appointmentText}>{appointment.time}</Text>
        </View>
      </View>
      <CustomButton
        title="View Details"
        onPress={() => navigation.navigate('BookingDetails', { bookingId: appointment.id })}
        variant="outline"
        size="small"
        style={styles.viewDetailsButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName}>John Doe</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(renderAppointmentCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color={theme.colors.textLight} />
              <Text style={styles.emptyStateText}>No upcoming appointments</Text>
              <CustomButton
                title="Book Your First Appointment"
                onPress={() => navigation.navigate('BookAppointment')}
                size="small"
              />
            </View>
          )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  greeting: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  userName: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  profileButton: {
    padding: theme.spacing.xs,
  },
  section: {
    padding: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  viewAllText: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...theme.shadows.small,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  quickActionTitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  appointmentCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  doctorName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  specialization: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  appointmentType: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  appointmentTypeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  appointmentDetails: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  appointmentText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.md,
  },
});
