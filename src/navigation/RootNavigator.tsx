import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { colors } from '../theme';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { OtpScreen } from '../screens/OtpScreen';
import { MainTabs } from './MainTabs';
import { AddCarScreen } from '../screens/AddCarScreen';
import { CarDetailScreen } from '../screens/CarDetailScreen';
import { NotificationHistoryScreen } from '../screens/NotificationHistoryScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Otp" component={OtpScreen} options={{ title: 'Verify' }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="AddCar" component={AddCarScreen} options={{ title: 'Add a tag' }} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} options={{ title: 'Tag' }} />
      <Stack.Screen
        name="Notifications"
        component={NotificationHistoryScreen}
        options={{ title: 'Notifications' }}
      />
    </Stack.Navigator>
  );
}
