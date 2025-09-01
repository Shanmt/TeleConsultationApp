import React, { createContext, useContext, useEffect, useState } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import FirebaseAuthService from '../config/firebase';
import FirestoreUserService from '../config/firestore';
import { User, RegistrationData } from '../types/user';

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  userProfile: User | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: RegistrationData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseAuthService.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          console.log('Attempting to load user profile for:', user.uid);
          const profile = await FirestoreUserService.getUserById(user.uid);
          setUserProfile(profile);
          console.log('User profile loaded:', profile ? 'Success' : 'Not found');
        } catch (error) {
          console.error('Failed to load user profile:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, userData: RegistrationData) => {
    try {
      console.log('Starting signup process...');
      
      const userCredential = await FirebaseAuthService.signUp(email, password);
      const userId = userCredential.user.uid;
      console.log('Firebase Auth user created with ID:', userId);
      
      // Convert registration data to user profile data
      const userProfileData = FirestoreUserService.convertRegistrationDataToUser(
        userId,
        email,
        userData
      );
      console.log('User profile data prepared:', userProfileData);
      
      // Create user document in Firestore
      console.log('Creating user document in Firestore...');
      await FirestoreUserService.createUser(userId, userProfileData);
      console.log('User document created successfully in Firestore');
      
      // Update local state
      setUserProfile({
        id: userId,
        ...userProfileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await FirebaseAuthService.signIn(email, password);
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await FirebaseAuthService.signOut();
    } catch (error: any) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await FirebaseAuthService.resetPassword(email);
    } catch (error: any) {
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    try {
      await FirestoreUserService.updateUser(user.uid, updates);
      
      // Update local state
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          ...updates,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      throw error;
    }
  };

  const refreshUserProfile = async () => {
    if (!user) {
      throw new Error('No user logged in');
    }
    
    try {
      const profile = await FirestoreUserService.getUserById(user.uid);
      setUserProfile(profile);
    } catch (error: any) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    refreshUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
