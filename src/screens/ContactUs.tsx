import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { theme } from '../constants/theme';
import { RootStackParamList } from '../types/navigation';

type ContactUsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ContactUs'
>;

interface Props {
  navigation: ContactUsScreenNavigationProp;
}

export const ContactUs: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const contactInfo = [
    {
      id: '1',
      title: 'Customer Support',
      subtitle: '24/7 Available',
      icon: 'headset',
      action: 'Call Now',
      value: '+1 (555) 123-4567',
      onPress: () => Linking.openURL('tel:+15551234567'),
    },
    {
      id: '2',
      title: 'Email Support',
      subtitle: 'Response within 24h',
      icon: 'mail',
      action: 'Send Email',
      value: 'support@teleconsultation.com',
      onPress: () => Linking.openURL('mailto:support@teleconsultation.com'),
    },
    {
      id: '3',
      title: 'Live Chat',
      subtitle: 'Instant Support',
      icon: 'chatbubbles',
      action: 'Start Chat',
      value: 'Available Now',
      onPress: () => Alert.alert('Live Chat', 'Live chat feature coming soon!'),
    },
  ];

  const faqItems = [
    {
      id: '1',
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by navigating to the "Book Appointment" section and selecting your preferred doctor, date, and time.',
    },
    {
      id: '2',
      question: 'What types of consultations are available?',
      answer: 'We offer video calls, audio calls, and chat consultations depending on your preference and the doctor\'s availability.',
    },
    {
      id: '3',
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time through the appointment details.',
    },
    {
      id: '4',
      question: 'How much does a consultation cost?',
      answer: 'Consultation fees vary by doctor and specialty, typically ranging from $50 to $200 per session.',
    },
  ];

  const handleSubmitForm = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual form submission
      await new Promise(resolve => setTimeout(() => resolve(undefined), 2000)); // Simulate API call
      
      Alert.alert('Success', 'Your message has been sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderContactCard = (contact: typeof contactInfo[0]) => (
    <View key={contact.id} style={styles.contactCard}>
      <View style={styles.contactHeader}>
        <View style={styles.contactIcon}>
          <Ionicons name={contact.icon as any} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>{contact.title}</Text>
          <Text style={styles.contactSubtitle}>{contact.subtitle}</Text>
        </View>
      </View>
      <Text style={styles.contactValue}>{contact.value}</Text>
      <CustomButton
        title={contact.action}
        onPress={contact.onPress}
        variant="outline"
        size="small"
        style={styles.contactButton}
      />
    </View>
  );

  const renderFaqItem = (faq: typeof faqItems[0]) => (
    <View key={faq.id} style={styles.faqItem}>
      <Text style={styles.faqQuestion}>{faq.question}</Text>
      <Text style={styles.faqAnswer}>{faq.answer}</Text>
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
          <Text style={styles.title}>Contact Us</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.sectionSubtitle}>
            We're here to help! Choose your preferred way to contact us.
          </Text>
        </View>

        <View style={styles.section}>
          {contactInfo.map(renderContactCard)}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.formCard}>
            <CustomInput
              label="Your Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              leftIcon="person"
            />
            <CustomInput
              label="Email Address"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <CustomInput
              label="Subject"
              placeholder="What is this about?"
              value={formData.subject}
              onChangeText={(text) => setFormData(prev => ({ ...prev, subject: text }))}
              leftIcon="document-text"
            />
            <CustomInput
              label="Message"
              placeholder="Tell us more about your inquiry..."
              value={formData.message}
              onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.messageInput}
            />
            <CustomButton
              title="Send Message"
              onPress={handleSubmitForm}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map(renderFaqItem)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.officeInfo}>
            <Text style={styles.officeTitle}>Our Office</Text>
            <View style={styles.officeDetails}>
              <View style={styles.officeDetail}>
                <Ionicons name="location" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.officeText}>
                  123 Healthcare Street, Medical District, NY 10001
                </Text>
              </View>
              <View style={styles.officeDetail}>
                <Ionicons name="time" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.officeText}>
                  Monday - Friday: 8:00 AM - 8:00 PM
                </Text>
              </View>
              <View style={styles.officeDetail}>
                <Ionicons name="time" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.officeText}>
                  Saturday - Sunday: 9:00 AM - 6:00 PM
                </Text>
              </View>
            </View>
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
  section: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  sectionSubtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  contactCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
  },
  contactSubtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  contactValue: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  contactButton: {
    alignSelf: 'flex-start',
  },
  formCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  messageInput: {
    height: 100,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  faqContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  faqItem: {
    marginBottom: theme.spacing.lg,
  },
  faqQuestion: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  faqAnswer: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  officeInfo: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.small,
  },
  officeTitle: {
    ...theme.typography.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  officeDetails: {
    gap: theme.spacing.sm,
  },
  officeDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  officeText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});
