export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  image: string;
  availableSlots: TimeSlot[];
  consultationFee: number;
  description: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  date: string;
  isAvailable: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctor: Doctor;
  patientId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  consultationType: 'video' | 'audio' | 'chat';
  symptoms?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFormData {
  doctorId: string;
  date: string;
  time: string;
  consultationType: 'video' | 'audio' | 'chat';
  symptoms?: string;
  notes?: string;
}
