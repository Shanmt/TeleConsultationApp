# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for your React Native Teleconsultation App.

## Prerequisites

1. A Google account
2. Android Studio (for Android development)
3. Your React Native project

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "TeleconsultationApp")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Add Android App to Firebase

1. In your Firebase project console, click the Android icon (</>) to add an Android app
2. Enter your Android package name: `com.teleconsultationapp`
3. Enter app nickname (optional): "TeleconsultationApp"
4. Click "Register app"

## Step 3: Download Configuration File

1. Download the `google-services.json` file
2. Place it in the `android/app/` directory of your React Native project
3. **Important**: Replace the placeholder `google-services.json` file with the one you downloaded

## Step 4: Enable Authentication

1. In the Firebase console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle the "Enable" switch
   - Click "Save"

## Step 5: Test the Setup

1. Clean and rebuild your project:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

2. Try registering a new user with email and password
3. Try logging in with the created credentials

## Features Implemented

✅ **User Registration**: Email/password registration with validation
✅ **User Login**: Email/password authentication
✅ **Password Reset**: Forgot password functionality
✅ **User Sign Out**: Secure logout from the app
✅ **Authentication State Management**: Automatic navigation based on auth state
✅ **Error Handling**: User-friendly error messages for all auth scenarios

## Security Features

- Password validation (minimum 6 characters)
- Email format validation
- Secure password reset via email
- Automatic session management
- Protected routes for authenticated users

## Troubleshooting

### Common Issues:

1. **"google-services.json not found"**
   - Make sure the file is in `android/app/google-services.json`
   - Verify the package name matches your app

2. **"Authentication failed"**
   - Check if Email/Password authentication is enabled in Firebase console
   - Verify your internet connection

3. **"App not registered"**
   - Ensure the package name in `google-services.json` matches your app's package name
   - Re-download the configuration file if needed

### Build Issues:

If you encounter build errors, try:
```bash
cd android
./gradlew clean
cd ..
npx react-native start --reset-cache
npm run android
```

## Next Steps

After setting up Firebase Authentication, you can:

1. Add additional authentication methods (Google, Facebook, etc.)
2. Implement user profile management
3. Add email verification
4. Set up Firestore for user data storage
5. Implement push notifications

## Support

If you encounter any issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Native Firebase Documentation](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com/)
