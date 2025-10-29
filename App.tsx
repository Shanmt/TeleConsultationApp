/**
 * TeleClinic365
 * React Native Mobile Application
 */

import React from 'react';
import { StatusBar, useColorScheme, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import { Registration } from './src/screens/Registration';
import { Login } from './src/screens/Login';
import { Dashboard } from './src/screens/Dashboard';
import { BookAppointment } from './src/screens/BookAppointment';
import { BookingDetails } from './src/screens/BookingDetails';
import { ContactUs } from './src/screens/ContactUs';
import { Profile } from './src/screens/Profile';

// Import types and context
import { RootStackParamList } from './src/types/navigation';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { theme } from './src/constants/theme';

const Stack = createStackNavigator<RootStackParamList>();

// Loading component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
  </View>
);

// Main app component with authentication logic
const AppContent = () => {
  const { user, loading } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="#008080"
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user ? "Dashboard" : "Login"}
          screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        >
          {user ? (
            // Authenticated user stack
            <>
              <Stack.Screen name="Dashboard" component={Dashboard} />
              <Stack.Screen name="BookAppointment" component={BookAppointment} />
              <Stack.Screen name="BookingDetails" component={BookingDetails} />
              <Stack.Screen name="ContactUs" component={ContactUs} />
              <Stack.Screen name="Profile" component={Profile} />
            </>
          ) : (
            // Authentication stack
            <>
              <Stack.Screen name="Registration" component={Registration} />
              <Stack.Screen name="Login" component={Login} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

// Root app component with providers
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
