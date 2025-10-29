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
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';

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

const getConsultationLabel = (value: string) => CONSULTATION_LABELS[value] || value;

type BookingDetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookingDetails'
>;

type BookingDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  'BookingDetails'
>;

interface Props {
  navigation: BookingDetailsScreenNavigationProp;
  route: BookingDetailsScreenRouteProp;
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

export const BookingDetails: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId } = route.params;
  const [appointment, setAppointment] = useState<AppointmentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [bookingId]);

  const fetchAppointmentDetails = async () => {
    try {
      const docRef = await firestore().collection('appointments').doc(bookingId).get();
      if (docRef.exists()) {
        const data = docRef.data() as AppointmentData;
        setAppointment({ ...data, id: docRef.id });
      } else {
        Alert.alert('Error', 'Appointment not found');
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      Alert.alert('Error', 'Failed to fetch appointment details');
      navigation.navigate('Dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'in_review':
        return theme.colors.warning;
      case 'rejected':
        return theme.colors.error;
      case 'completed':
        return theme.colors.info;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'checkmark-circle';
      case 'in_review':
        return 'time';
      case 'rejected':
        return 'close-circle';
      case 'completed':
        return 'checkmark-done-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'in_review':
        return 'Pending';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getUrgencyLevelText = (urgency: string) => {
    switch (urgency) {
      case 'low':
        return 'Low - Routine Checkup';
      case 'normal':
        return 'Normal - Within a week';
      case 'high':
        return 'High - Within 2-3 days';
      case 'urgent':
        return 'Urgent - Same day';
      default:
        return urgency;
    }
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: async () => {
            try {
              await firestore()
                .collection('appointments')
                .doc(appointment?.id)
                .update({ status: 'cancelled', updatedAt: new Date().toISOString() });
              Alert.alert('Success', 'Appointment cancelled successfully');
              navigation.navigate('Dashboard');
            } catch (error) {
              console.error('Error cancelling appointment:', error);
              Alert.alert('Error', 'Failed to cancel appointment. Please try again.');
            }
          }
        },
      ]
    );
  };

  // Removed reschedule handler
  // const handleReschedule = () => {
  //   navigation.navigate('BookAppointment');
  // };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading appointment details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Appointment not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Booking Information</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={getStatusIcon(appointment.status)} 
              size={24} 
              color={getStatusColor(appointment.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
              {getStatusText(appointment.status)}
            </Text>
          </View>
          <Text style={styles.appointmentId}>ID: {appointment.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{appointment.fullName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="mail" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{appointment.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{appointment.phoneNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>DOB:</Text>
              <Text style={styles.detailValue}>{appointment.dateOfBirth}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="person-circle" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Gender:</Text>
              <Text style={styles.detailValue}>{appointment.gender.charAt(0).toUpperCase() + appointment.gender.slice(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="medical" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>{getConsultationLabel(appointment.consultationType)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{appointment.preferredDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{appointment.selectedTimeSlot}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="warning" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Urgency:</Text>
              <Text style={styles.detailValue}>{getUrgencyLevelText(appointment.urgencyLevel)}</Text>
            </View>
          </View>
        </View>

        {appointment.currentMedication && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Medication</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{appointment.currentMedication}</Text>
            </View>
          </View>
        )}

        {appointment.currentSymptoms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Symptoms</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{appointment.currentSymptoms}</Text>
            </View>
          </View>
        )}

        {appointment.specialRequests && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Requests</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>{appointment.specialRequests}</Text>
            </View>
          </View>
        )}

        {/* Show Cancel button only if appointment is not cancelled */}
        {appointment.status !== 'cancelled' && (
          <View style={styles.actionsSection}>
            <View style={styles.secondaryActions}>
              <CustomButton
                title="Cancel"
                onPress={handleCancelAppointment}
                variant="outline"
                style={styles.secondaryButton}
              />
            </View>
          </View>
        )}
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
    paddingTop: 0,
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
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  statusCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusText: {
    ...theme.typography.h4,
    marginLeft: theme.spacing.sm,
  },
  appointmentId: {
    ...theme.typography.bodySmall,
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
  detailsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  detailLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    minWidth: 60,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    flex: 1,
  },
  infoCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  actionsSection: {
    padding: theme.spacing.lg,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    flex: 0,
    marginHorizontal: theme.spacing.xs,
  },
});
