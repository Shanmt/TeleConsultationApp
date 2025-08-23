import React, { useState } from 'react';
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
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { Doctor, BookingFormData } from '../types/appointment';

type BookAppointmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookAppointment'
>;

interface Props {
  navigation: BookAppointmentScreenNavigationProp;
}

export const BookAppointment: React.FC<Props> = ({ navigation }) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'audio' | 'chat'>('video');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);

  const doctors: Doctor[] = [
    {
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
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      experience: 12,
      rating: 4.9,
      image: 'https://example.com/doctor2.jpg',
      availableSlots: [],
      consultationFee: 120,
      description: 'Specialist in skin conditions and cosmetic dermatology.',
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialization: 'Pediatrics',
      experience: 10,
      rating: 4.7,
      image: 'https://example.com/doctor3.jpg',
      availableSlots: [],
      consultationFee: 100,
      description: 'Caring pediatrician with focus on child health and development.',
    },
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const consultationTypes = [
    { type: 'video', label: 'Video Call', icon: 'videocam' },
    { type: 'audio', label: 'Audio Call', icon: 'call' },
    { type: 'chat', label: 'Chat', icon: 'chatbubble' },
  ];

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a doctor, date, and time.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual booking logic
      await new Promise(resolve => setTimeout(() => resolve(undefined), 2000)); // Simulate API call
      
      Alert.alert('Success', 'Appointment booked successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('BookingDetails', { bookingId: 'new-booking-id' }) },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDoctorCard = (doctor: Doctor) => (
    <TouchableOpacity
      key={doctor.id}
      style={[
        styles.doctorCard,
        selectedDoctor?.id === doctor.id && styles.selectedDoctorCard
      ]}
      onPress={() => setSelectedDoctor(doctor)}
    >
      <View style={styles.doctorInfo}>
        <View style={styles.doctorAvatar}>
          <Ionicons name="person" size={32} color={theme.colors.primary} />
        </View>
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialization}>{doctor.specialization}</Text>
          <View style={styles.doctorStats}>
            <View style={styles.stat}>
              <Ionicons name="star" size={14} color={theme.colors.warning} />
              <Text style={styles.statText}>{doctor.rating}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="time" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.statText}>{doctor.experience} years</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="cash" size={14} color={theme.colors.success} />
              <Text style={styles.statText}>${doctor.consultationFee}</Text>
            </View>
          </View>
        </View>
      </View>
      {selectedDoctor?.id === doctor.id && (
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  const renderConsultationType = (type: typeof consultationTypes[0]) => (
    <TouchableOpacity
      key={type.type}
      style={[
        styles.consultationTypeCard,
        consultationType === type.type && styles.selectedConsultationType
      ]}
      onPress={() => setConsultationType(type.type as any)}
    >
      <Ionicons 
        name={type.icon as any} 
        size={24} 
        color={consultationType === type.type ? theme.colors.background : theme.colors.primary} 
      />
      <Text style={[
        styles.consultationTypeText,
        consultationType === type.type && styles.selectedConsultationTypeText
      ]}>
        {type.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Book Appointment</Text>
          <Text style={styles.subtitle}>Choose your doctor and appointment details</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Doctor</Text>
          {doctors.map(renderDoctorCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Date</Text>
          <CustomInput
            placeholder="Select date (YYYY-MM-DD)"
            value={selectedDate}
            onChangeText={setSelectedDate}
            leftIcon="calendar"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Time Slots</Text>
          <View style={styles.timeSlotsGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.selectedTimeSlot
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeSlotText,
                  selectedTime === time && styles.selectedTimeSlotText
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consultation Type</Text>
          <View style={styles.consultationTypesGrid}>
            {consultationTypes.map(renderConsultationType)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms (Optional)</Text>
          <CustomInput
            placeholder="Describe your symptoms..."
            value={symptoms}
            onChangeText={setSymptoms}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={styles.symptomsInput}
          />
        </View>

        <View style={styles.section}>
          <CustomButton
            title="Book Appointment"
            onPress={handleBookAppointment}
            loading={loading}
            disabled={!selectedDoctor || !selectedDate || !selectedTime}
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
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
  doctorCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.small,
  },
  selectedDoctorCard: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.secondary,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  doctorDetails: {
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
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedTimeSlot: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  timeSlotText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  selectedTimeSlotText: {
    color: theme.colors.background,
  },
  consultationTypesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  consultationTypeCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedConsultationType: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  consultationTypeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.xs,
  },
  selectedConsultationTypeText: {
    color: theme.colors.background,
  },
  symptomsInput: {
    height: 100,
  },
});
