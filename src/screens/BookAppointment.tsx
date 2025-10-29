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
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type BookAppointmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'BookAppointment'
>;

interface Props {
  navigation: BookAppointmentScreenNavigationProp;
}

export const BookAppointment: React.FC<Props> = ({ navigation }) => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDobDatePicker, setShowDobDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDobDate, setSelectedDobDate] = useState(new Date());
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  
  // Form fields
  const [consultationType, setConsultationType] = useState('Pregnancy');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [preferredDate, setPreferredDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [currentMedication, setCurrentMedication] = useState('');
  const [currentSymptoms, setCurrentSymptoms] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('normal');
  const [specialRequests, setSpecialRequests] = useState('');

  // Pre-populate user details when component mounts
  useEffect(() => {
    if (userProfile) {
      setFullName(`${userProfile.firstName} ${userProfile.lastName}`);
      setEmail(userProfile.email);
      setPhoneNumber(userProfile.phone);
      if (userProfile.dateOfBirth) {
        setDateOfBirth(userProfile.dateOfBirth);
      }
      if (userProfile.gender) {
        setGender(userProfile.gender);
      }
    }
    // Initialize with default time slots
    setAvailableTimeSlots(defaultTimeSlots);
  }, [userProfile]);

  const consultationTypes = [
    { value: 'Pregnancy', label: 'Pregnancy Consultations' },
    { value: 'High_Risk_Pregnancy', label: 'High risk pregnancy consultations' },
    { value: 'Fetal_Medicine', label: 'Fetal Medicine opinion' },
    { value: 'Pre_Pregnancy', label: 'Pre- pregnancy counselling' },
    { value: 'Genetic_Counselling', label: 'Genetic Counselling' },
    { value: 'Surgical', label: 'Surgical Consultations' },
    { value: 'Respiratory', label: 'Respiratory Medicine Consultations' },
    { value: 'Second_Opinion', label: 'Second opinion for Doctors' },
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Routine Checkup' },
    { value: 'normal', label: 'Normal - Within a week' },
    { value: 'high', label: 'High - Within 2-3 days' },
    { value: 'urgent', label: 'Urgent - Same day' },
  ];

  // Default time slots (fallback)
  const defaultTimeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`; // DD/MM/YYYY format
      setPreferredDate(formattedDate);
      // Fetch available time slots for the selected date
      fetchAvailableTimeSlots(formattedDate);
    }
  };

  const handleDobDateChange = (event: any, date?: Date) => {
    setShowDobDatePicker(false);
    if (date) {
      setSelectedDobDate(date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`; // DD/MM/YYYY format
      setDateOfBirth(formattedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showDobDatePickerModal = () => {
    setShowDobDatePicker(true);
  };

  const fetchAvailableTimeSlots = async (selectedDate: string) => {
    try {
      setIsLoadingSlots(true);
      setSelectedTimeSlot(''); // Reset selected slot when date changes
      
      // Use DD/MM/YYYY format for Firestore query
      const firestoreDate = selectedDate; // Keep DD/MM/YYYY format
      
      const scheduleRef = firestore().collection('appointmentSchedules');
      const query = scheduleRef.where('date', '==', firestoreDate);
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        // No schedule found for this date, continue with current/default slots
        setAvailableTimeSlots(defaultTimeSlots);
        return;
      }
      
      const scheduleDoc = snapshot.docs[0];
      const scheduleData = scheduleDoc.data();
      
      if (scheduleData.isBookingAllowed === false) {
        Alert.alert('No Slots Available', 'There are no slots available for the selected date. Please choose another date.');
        setAvailableTimeSlots([]);
        setPreferredDate('');
        return;
      }
      
      // If booking is allowed, continue with current/default slots
      // No need to fetch timeSlots from collection
      setAvailableTimeSlots(defaultTimeSlots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      Alert.alert('Error', 'Failed to fetch available time slots. Using default slots.');
      setAvailableTimeSlots(defaultTimeSlots);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBookAppointment = async () => {
    // Validation
    if (!fullName || !email || !phoneNumber || !dateOfBirth || !preferredDate || !selectedTimeSlot) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (!currentSymptoms) {
      Alert.alert('Error', 'Please describe your current symptoms.');
      return;
    }

    setLoading(true);
    try {
      // Create appointment object
      const appointmentData = {
        userId: userProfile?.id || '',
        consultationType,
        fullName,
        email,
        phoneNumber,
        dateOfBirth,
        gender,
        preferredDate,
        selectedTimeSlot,
        currentMedication,
        currentSymptoms,
        urgencyLevel,
        specialRequests,
        status: 'in_review',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Insert into Firestore appointments collection
      const appointmentsRef = firestore().collection('appointments');
      const docRef = await appointmentsRef.add(appointmentData);
      
      console.log('Appointment created successfully with ID:', docRef.id);
      
      Alert.alert('Success', 'Appointment booked successfully! Your appointment is now under review.', [
        { text: 'OK', onPress: () => navigation.navigate('BookingDetails', { bookingId: docRef.id }) },
      ]);
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = (
    label: string,
    value: string,
    options: { value: string; label: string }[],
    onValueChange: (value: string) => void,
    required: boolean = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.dropdownContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.dropdownOption,
              value === option.value && styles.selectedDropdownOption
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text style={[
              styles.dropdownOptionText,
              value === option.value && styles.selectedDropdownOptionText
            ]}>
              {option.label}
            </Text>
            {value === option.value && (
              <Ionicons name="checkmark" size={16} color={theme.colors.background} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTimeSlots = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        Available Slots <Text style={styles.required}>*</Text>
      </Text>
      {isLoadingSlots ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading available slots...</Text>
        </View>
      ) : availableTimeSlots.length > 0 ? (
        <View style={styles.timeSlotsGrid}>
          {availableTimeSlots.map((time: string) => (
            <TouchableOpacity
              key={time}
              style={[
                styles.timeSlot,
                selectedTimeSlot === time && styles.selectedTimeSlot
              ]}
              onPress={() => setSelectedTimeSlot(time)}
            >
              <Text style={[
                styles.timeSlotText,
                selectedTimeSlot === time && styles.selectedTimeSlotText
              ]}>
                {time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noSlotsContainer}>
          <Text style={styles.noSlotsText}>No slots available for selected date</Text>
        </View>
      )}
    </View>
  );

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
          <View style={styles.headerContent}>
            <Text style={styles.title}>New Appointment</Text>
            <Text style={styles.subtitle}>Schedule your consultation</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          {/* Consultation Type */}
          {renderDropdown(
            'Consultation Type',
            consultationType,
            consultationTypes,
            setConsultationType,
            true
          )}

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <CustomInput
              label="Full Name *"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              leftIcon="person"
            />

            <CustomInput
              label="Email Address *"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Phone Number *"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              leftIcon="call"
              keyboardType="phone-pad"
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Date of Birth <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={showDobDatePickerModal}
              >
                <View style={styles.datePickerContent}>
                  <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
                  <Text style={[
                    styles.datePickerText,
                    !dateOfBirth && styles.placeholderText
                  ]}>
                    {dateOfBirth || 'Select your date of birth'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {showDobDatePicker && (
                <DateTimePicker
                  value={selectedDobDate}
                  mode="date"
                  display="default"
                  onChange={handleDobDateChange}
                  maximumDate={new Date()}
                />
              )}
            </View>

            {renderDropdown(
              'Gender',
              gender,
              genderOptions,
              setGender,
              true
            )}
          </View>

          {/* Appointment Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Preferred Date <Text style={styles.required}>*</Text>
              </Text>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={showDatePickerModal}
              >
                <View style={styles.datePickerContent}>
                  <Ionicons name="calendar" size={20} color={theme.colors.textSecondary} />
                  <Text style={[
                    styles.datePickerText,
                    !preferredDate && styles.placeholderText
                  ]}>
                    {preferredDate || 'Select preferred date'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                />
              )}
            </View>

            {renderTimeSlots()}
          </View>

          {/* Medical Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            
            <CustomInput
              label="Current Medication"
              placeholder="List any current medications (optional)"
              value={currentMedication}
              onChangeText={setCurrentMedication}
              leftIcon="medical"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <CustomInput
              label="Current Symptoms *"
              placeholder="Describe your current symptoms..."
              value={currentSymptoms}
              onChangeText={setCurrentSymptoms}
              leftIcon="warning"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            {renderDropdown(
              'Urgency Level',
              urgencyLevel,
              urgencyLevels,
              setUrgencyLevel,
              true
            )}
          </View>

          {/* Special Requests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <CustomInput
              label="Special Requests"
              placeholder="Any special requests or additional information (optional)"
              value={specialRequests}
              onChangeText={setSpecialRequests}
              leftIcon="chatbubble"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <View style={styles.section}>
            <CustomButton
              title="Book Appointment"
              onPress={handleBookAppointment}
              loading={loading}
              disabled={!fullName || !email || !phoneNumber || !dateOfBirth || !preferredDate || !selectedTimeSlot || !currentSymptoms}
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
  headerContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
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
  placeholder: {
    width: 40,
  },
  form: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingBottom: theme.spacing.sm,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  required: {
    color: theme.colors.error,
  },
  dropdownContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedDropdownOption: {
    backgroundColor: theme.colors.primary,
  },
  dropdownOptionText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
  },
  selectedDropdownOptionText: {
    color: theme.colors.background,
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
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    minHeight: 50,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  datePickerText: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  placeholderText: {
    color: theme.colors.textLight,
  },
  loadingContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  noSlotsContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  noSlotsText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});
