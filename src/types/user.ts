export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}
