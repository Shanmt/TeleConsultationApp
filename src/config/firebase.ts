import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Firebase Authentication Service
export class FirebaseAuthService {
  // Get current user
  static getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  // Sign up with email and password
  static async signUp(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with email and password
  static async signIn(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      return userCredential;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      throw new Error('Failed to sign out');
    }
  }

  // Reset password
  static async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Update user profile
  static async updateProfile(displayName: string): Promise<void> {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateProfile({
          displayName,
        });
      }
    } catch (error: any) {
      throw new Error('Failed to update profile');
    }
  }

  // Listen to auth state changes
  static onAuthStateChanged(callback: (user: FirebaseAuthTypes.User | null) => void) {
    return auth().onAuthStateChanged(callback);
  }

  // Get error messages
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return 'An error occurred. Please try again';
    }
  }
}

export default FirebaseAuthService;
