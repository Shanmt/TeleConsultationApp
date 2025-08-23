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
import { RouteProp } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { Appointment } from '../types/appointment';

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

export const BookingDetails: React.FC<Props> = ({ navigation, route }) => {
  const { bookingId } = route.params;

  // Mock appointment data - in real app, fetch from API
  const appointment: Appointment = {
    id: bookingId,
    doctorId: '1',
    doctor: {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      experience: 15,
      rating: 4.8,
      image: 'https://example.com/doctor1.jpg',
      availableSlots: [],
      consultationFee: 150,
      description: 'Experienced cardiologist with expertise in heart conditions.',
    },
    patientId: 'patient-1',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    consultationType: 'video',
    symptoms: 'Chest pain and shortness of breath',
    notes: 'Patient has a history of heart conditions',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return theme.colors.success;
      case 'pending':
        return theme.colors.warning;
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
      case 'pending':
        return 'time';
      case 'completed':
        return 'checkmark-done-circle';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const handleJoinConsultation = () => {
    Alert.alert('Join Consultation', 'Starting video consultation...');
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
          onPress: () => {
            Alert.alert('Success', 'Appointment cancelled successfully');
            navigation.goBack();
          }
        },
      ]
    );
  };

  const handleReschedule = () => {
    navigation.navigate('BookAppointment');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Appointment Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Ionicons 
              name={getStatusIcon(appointment.status)} 
              size={24} 
              color={getStatusColor(appointment.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.appointmentId}>ID: {appointment.id}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doctor Information</Text>
          <View style={styles.doctorCard}>
            <View style={styles.doctorAvatar}>
              <Ionicons name="person" size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{appointment.doctor.name}</Text>
              <Text style={styles.doctorSpecialization}>{appointment.doctor.specialization}</Text>
              <View style={styles.doctorStats}>
                <View style={styles.stat}>
                  <Ionicons name="star" size={14} color={theme.colors.warning} />
                  <Text style={styles.statText}>{appointment.doctor.rating}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
                  <Text style={styles.statText}>{appointment.doctor.experience} years</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="cash" size={14} color={theme.colors.success} />
                  <Text style={styles.statText}>${appointment.doctor.consultationFee}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{appointment.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>{appointment.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons 
                name={appointment.consultationType === 'video' ? 'videocam' : 'call'} 
                size={20} 
                color={theme.colors.textSecondary} 
              />
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailValue}>
                {appointment.consultationType.charAt(0).toUpperCase() + appointment.consultationType.slice(1)} Consultation
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cash" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.detailLabel}>Fee:</Text>
              <Text style={styles.detailValue}>${appointment.doctor.consultationFee}</Text>
            </View>
          </View>
        </View>

        {appointment.symptoms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Symptoms</Text>
            <View style={styles.symptomsCard}>
              <Text style={styles.symptomsText}>{appointment.symptoms}</Text>
            </View>
          </View>
        )}

        {appointment.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          </View>
        )}

        <View style={styles.actionsSection}>
          {appointment.status === 'confirmed' && (
            <CustomButton
              title="Join Consultation"
              onPress={handleJoinConsultation}
              style={styles.joinButton}
            />
          )}
          
          <View style={styles.secondaryActions}>
            <CustomButton
              title="Reschedule"
              onPress={handleReschedule}
              variant="outline"
              style={styles.secondaryButton}
            />
            <CustomButton
              title="Cancel"
              onPress={handleCancelAppointment}
              variant="outline"
              style={styles.secondaryButton}
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
  backButton: {
    padding: theme.spacing.xs,
  },
  title: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 40,
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
  doctorCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  doctorSpecialization: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  doctorStats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  statText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
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
  symptomsCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  symptomsText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  notesCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  notesText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  actionsSection: {
    padding: theme.spacing.lg,
  },
  joinButton: {
    marginBottom: theme.spacing.md,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  cancelButton: {
    borderColor: theme.colors.error,
  },
});
