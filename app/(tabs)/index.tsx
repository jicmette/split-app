import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SetupForm from "../../components/SetupForm";
import { Bill, UserProfile } from "../../constants/types";

// Main Dashboard Screen
export default function DashboardScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBills, setBills] = useState<Bill[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const profileString = await AsyncStorage.getItem("userProfile");
          if (profileString) {
            setUserProfile(JSON.parse(profileString));
          }
          const billString = await AsyncStorage.getItem("userBills");
          if (billString) {
            setBills(JSON.parse(billString));
          }
        } catch (e) {
          console.error("Failed to load profile", e);
        }
        setIsLoading(false);
      };
      loadData();
    }, [])
  );

  const handleSaveProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
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

  if (userBills.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.title}>{userProfile.name}</Text>
        <Text style={styles.subtitle}>Paycheck: ${formattedSalary}</Text>
        <Text style={styles.subtitle}>
          Frequency: {userProfile.payFrequency}
        </Text>
        <Text
          style={[styles.subtitle, { marginTop: 40, paddingHorizontal: 20 }]}
        >
          Great! Your profile is set up. Next, lets add your monthly bills.
        </Text>
        <Link href="/modal" asChild>
          <Pressable style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add First Bill</Text>
          </Pressable>
        </Link>
      </View>
    );
  }
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.title}>{userProfile.name}</Text>
      <Text style={styles.subtitle}>Paycheck: ${formattedSalary}</Text>
      <Text style={styles.subtitle}>Frequency: {userProfile.payFrequency}</Text>
      <Text style={styles.title}>Your Paycheck Plan</Text>
      <Text>You have {userBills.length} bills saved.</Text>
      <Link href="/modal" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Bill</Text>
        </Pressable>
      </Link>
      {/* TODO: Build the "Paycheck Checklist" here */}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    padding: 10,
    margin: 0,
    textAlign: "center",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#007AFF", // Blue
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
