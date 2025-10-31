import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet, Text,
  View
} from 'react-native';
import SetupForm from '../../components/SetupForm';
import { UserProfile } from '../../constants/types';


// Main Dashboard Screen
export default function DashboardScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileString = await AsyncStorage.getItem('userProfile');
        if (profileString) {
          setUserProfile(JSON.parse(profileString));
        }
      } catch (e) {
        console.error("Failed to load profile", e);
      }
      setIsLoading(false);
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setUserProfile(profile);
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (!userProfile) {
    return <SetupForm onSave={handleSaveProfile} />;
  }

  const formattedSalary = new Intl.NumberFormat().format(userProfile.salary);

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.title}>{userProfile.name}</Text>
      <Text style={styles.subtitle}>Paycheck: ${formattedSalary}</Text>
      <Text style={styles.subtitle}>Frequency: {userProfile.payFrequency}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    padding: 10,
    margin: 0,
    textAlign: 'center',
    fontWeight: '500',
  },
});