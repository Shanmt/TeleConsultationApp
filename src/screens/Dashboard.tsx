import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Image,
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
  Pregnancy: 'Pregnancy Consultations',
  High_Risk_Pregnancy: 'High risk pregnancy consultations',
  Fetal_Medicine: 'Fetal Medicine opinion',
  Pre_Pregnancy: 'Pre- pregnancy counselling',
  Genetic_Counselling: 'Genetic Counselling',
  Surgical: 'Surgical Consultations',
  Respiratory: 'Respiratory Medicine Consultations',
  Second_Opinion: 'Second opinion for Doctors',
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
      color: '#20B2AA', // Teal color
    },
    {
      id: '2',
      title: 'Contact Support',
      icon: 'headset',
      onPress: () => navigation.navigate('ContactUs'),
      color: '#FF8C00', // Orange color
    },
  ];

  const renderQuickAction = (action: typeof quickActions[0]) => (
    <TouchableOpacity
      key={action.id}
      style={[styles.quickActionCard, { backgroundColor: action.color }]}
      onPress={action.onPress}
    >
      <Ionicons name={action.icon as any} size={24} color="white" />
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderAppointmentCard = (appointment: AppointmentData) => {
    const statusMeta = getStatusMeta(appointment.status);
    const formatDate = (dateString: string) => {
      try {
        // Handle different date formats
        let date: Date;
        if (dateString.includes('/')) {
          // Handle MM/DD/YYYY format
          const [month, day, year] = dateString.split('/');
          date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else if (dateString.includes('-')) {
          // Handle YYYY-MM-DD format
          date = new Date(dateString);
        } else {
          // Try parsing as is
          date = new Date(dateString);
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
          return dateString; // Return original string if parsing fails
        }
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
      } catch (error) {
        console.error('Date parsing error:', error, 'Date string:', dateString);
        return dateString; // Return original string if parsing fails
      }
    };
    
    return (
      <TouchableOpacity 
        key={appointment.id} 
        style={styles.appointmentCard}
        onPress={() => navigation.navigate('BookingDetails', { bookingId: appointment.id })}
      >
        <View style={[styles.appointmentBorder, { backgroundColor: statusMeta.color }]} />
        <View style={styles.appointmentContent}>
          <Text style={styles.appointmentTitle}>
            {getConsultationLabel(appointment.consultationType)}
          </Text>
          <Text style={styles.appointmentDate}>
            {formatDate(appointment.preferredDate)} | {appointment.selectedTimeSlot}
          </Text>
          <Text style={styles.appointmentUrgency}>
            {getUrgencyLabel(appointment.urgencyLevel)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.logoBanner}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                Hi, {userProfile ? userProfile.firstName : 'User'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle" size={40} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
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
            <View style={styles.appointmentsContainer}>
              {upcomingAppointments.map(renderAppointmentCard)}
            </View>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logoBanner: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  logoImage: {
    width: 280,
    height: 80,
    maxWidth: '90%',
  },
  greeting: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
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
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.small,
  },
  quickActionTitle: {
    ...theme.typography.bodySmall,
    color: 'white',
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontWeight: '500',
  },
  appointmentsContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  appointmentCard: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
    position: 'relative',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    ...theme.shadows.small,
  },
  appointmentBorder: {
    width: 4,
    borderRadius: 2,
    marginRight: theme.spacing.md,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    ...theme.typography.h5,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  appointmentDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  appointmentUrgency: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
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

