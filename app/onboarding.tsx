import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';

const donePressed = async (router: any) => {
  try {
    await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
    router.replace('/(tabs)');
  } catch (error) {
    console.error("Failed to save onboarding status", error);
  }
};

const OnboardingScreen = () => {
  const router = useRouter();

  return (
    <Onboarding
      onDone={() => donePressed(router)}
      onSkip={() => donePressed(router)}

      pages={[
        {
          backgroundColor: '#fff',
          image: <Image style={styles.image} source={require('../assets/images/onboarding-1.png')} />,
          title: 'Welcome to Split!',
          subtitle: 'Tired of paycheck anxiety? It\'s hard to know how much of your paycheck is "safe" to spend.',
        },
        {
          backgroundColor: '#fff',
          image: <Image style={styles.image} source={require('../assets/images/onboarding-2.png')} />,
          title: 'We Do the Math For You',
          subtitle: 'Tell us your pay schedule and your monthly bills. We automatically calculate what to set aside from each paycheck.',
        },
        {
          backgroundColor: '#fff',
          image: <Image style={styles.image} source={require('../assets/images/onboarding-3.png')} />,
          title: 'Spend Stress-Free',
          subtitle: "Know exactly what's left over to spend or save. Let's get your plan set up!",
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
});

export default OnboardingScreen;