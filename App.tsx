/**
 * Teleconsultation App
 * React Native Mobile Application
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
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

// Import types
import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor="#008080"
      />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Registration"
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
          {/* Auth Stack */}
          <Stack.Screen name="Registration" component={Registration} />
          <Stack.Screen name="Login" component={Login} />
          
          {/* Main App Stack */}
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="BookAppointment" component={BookAppointment} />
          <Stack.Screen name="BookingDetails" component={BookingDetails} />
          <Stack.Screen name="ContactUs" component={ContactUs} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
