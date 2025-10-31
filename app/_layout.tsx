import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen, Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const flag = await AsyncStorage.getItem('hasCompletedOnboarding');

        if (flag === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        console.error("Failed to check onboarding status", error);
        router.replace('/onboarding');
      } finally {
        SplashScreen.hideAsync();
      }
    };

    checkOnboardingStatus();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Add New Bill' }} />
    </Stack>
  );
}