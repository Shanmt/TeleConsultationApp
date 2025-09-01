import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { User, RegistrationData } from '../types/user';

// Firestore User Service
export class FirestoreUserService {
  private static getUsersCollection() {
    return firestore().collection('users');
  }

  // Create a new user document
  static async createUser(userId: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    try {
      const now = new Date().toISOString();
      const userDocument: User = {
        id: userId,
        ...userData,
        createdAt: now,
        updatedAt: now,
      };

      await this.getUsersCollection().doc(userId).set(userDocument);
    } catch (error: any) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const doc = await this.getUsersCollection().doc(userId).get();
      if (doc.exists()) {
        return doc.data() as User;
      }
      return null;
    } catch (error: any) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Update user data
  static async updateUser(userId: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.getUsersCollection().doc(userId).update(updateData);
    } catch (error: any) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user document
  static async deleteUser(userId: string): Promise<void> {
    try {
      await this.getUsersCollection().doc(userId).delete();
    } catch (error: any) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Convert registration data to user data
  static convertRegistrationDataToUser(
    userId: string, 
    email: string, 
    registrationData: RegistrationData
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      email,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      phone: registrationData.phone,
      dateOfBirth: registrationData.dateOfBirth,
      gender: registrationData.gender,
    };
  }

  // Check if user document exists
  static async userExists(userId: string): Promise<boolean> {
    try {
      const doc = await this.getUsersCollection().doc(userId).get();
      return doc.exists();
    } catch (error: any) {
      throw new Error(`Failed to check user existence: ${error.message}`);
    }
  }

  // Get all users (for admin purposes)
  static async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await this.getUsersCollection().get();
      return snapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => doc.data() as User);
    } catch (error: any) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }
}

export default FirestoreUserService;
