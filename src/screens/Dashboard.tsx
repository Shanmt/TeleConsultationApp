import React, { useState, useEffect } from 'react';
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
import firestore from '@react-native-firebase/firestore';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Dashboard'
>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

interface AppointmentData {
  id: string;
  userId: string;
  consultationType: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  preferredDate: string;
  selectedTimeSlot: string;
  currentMedication: string;
  currentSymptoms: string;
  urgencyLevel: string;
  specialRequests: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const CONSULTATION_LABELS: Record<string, string> = {
  General: 'General & Preventive Consultation',
  Menstrual: 'Menstrual & Hormonal Issues',
  Fertility: 'Fertility & Pregnancy',
  Gynecological: 'Gynecological Consultation',
  Specialized: 'Specialized Consultation',
};

const URGENCY_LABELS: Record<string, string> = {
  low: 'Low - Routine Checkup',
  normal: 'Normal - Within a week',
  high: 'High - Within 2-3 days',
  urgent: 'Urgent - Same day',
};

const getConsultationLabel = (value: string) => CONSULTATION_LABELS[value] || value;
const getUrgencyLabel = (value: string) => URGENCY_LABELS[value] || value;

// Status mapping helper
const getStatusMeta = (status: string) => {
  switch (status) {
    case 'in_review':
      return { label: 'Pending', color: theme.colors.warning, icon: 'time' as const };
    case 'confirmed':
      return { label: 'Confirmed', color: theme.colors.success, icon: 'checkmark-circle' as const };
    case 'rejected':
      return { label: 'Rejected', color: theme.colors.error, icon: 'close-circle' as const };
    case 'completed':
      return { label: 'Completed', color: theme.colors.primary, icon: 'checkmark-done' as const };
    case 'cancelled':
      return { label: 'Cancelled', color: theme.colors.error, icon: 'close-circle' as const };
    default:
      return { label: 'Pending', color: theme.colors.warning, icon: 'time' as const };
  }
};

export const Dashboard: React.FC<Props> = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile?.id) {
      fetchUpcomingAppointments();
    }
  }, [userProfile]);

  const fetchUpcomingAppointments = async () => {
    try {
      setLoading(true);
      const appointmentsRef = firestore().collection('appointments');
      const query = appointmentsRef.where('userId', '==', userProfile?.id);
      const snapshot = await query.get();
      const appointments: AppointmentData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as AppointmentData;
        appointments.push({ ...data, id: doc.id });
      });
      // Sort appointments by preferredDate (if present)
      appointments.sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime());
      setUpcomingAppointments(appointments);
    } catch (error: any) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to fetch upcoming appointments');
    } finally {
      setLoading(false);
    }
  };

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
      title: 'Contact Support',
      icon: 'help-circle',
      onPress: () => navigation.navigate('ContactUs'),
      color: theme.colors.warning,
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

  const renderAppointmentCard = (appointment: AppointmentData) => {
    const statusMeta = getStatusMeta(appointment.status);
    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <View style={styles.appointmentHeaderLeft}>
            <Text
              style={styles.appointmentTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {getConsultationLabel(appointment.consultationType)}
            </Text>
            <Text style={styles.appointmentDate}>{appointment.preferredDate}</Text>
          </View>
          <View style={styles.appointmentStatus}>
            <Ionicons 
              name={statusMeta.icon}
              size={16}
              color={statusMeta.color}
            />
            <Text style={[
              styles.appointmentStatusText,
              { color: statusMeta.color }
            ]}>
              {statusMeta.label}
            </Text>
          </View>
        </View>
        <View style={styles.appointmentDetails}>
          <View style={styles.appointmentInfo}>
            <Ionicons name="time" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.appointmentText}>{appointment.selectedTimeSlot}</Text>
          </View>
          <View style={styles.appointmentInfo}>
            <Ionicons name="warning" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.appointmentText}>{getUrgencyLabel(appointment.urgencyLevel)}</Text>
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning!</Text>
            <Text style={styles.userName}>
              {userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'}
            </Text>
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
            <TouchableOpacity onPress={fetchUpcomingAppointments}>
              <Text style={styles.viewAllText}>Refresh</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading appointments...</Text>
            </View>
          ) : upcomingAppointments.length > 0 ? (
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
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '100%',
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
  appointmentHeaderLeft: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  appointmentTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  appointmentDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  appointmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
    flexShrink: 0,
  },
  appointmentStatusText: {
    ...theme.typography.caption,
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
  loadingContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  symptomsPreview: {
    backgroundColor: theme.colors.secondaryLight,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  symptomsText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

