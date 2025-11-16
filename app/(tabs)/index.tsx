import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, signOut } from "@react-native-firebase/auth";
import { doc, getFirestore, setDoc } from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Link, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import SetupForm from "../../components/SetupForm";
import { Bill, PaycheckPlanItem, UserProfile } from "../../constants/types";
import { calculatePaycheckPlan } from "../../utils/planCalculator";

// Main Dashboard Screen
export default function DashboardScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userBills, setBills] = useState<Bill[]>([]);
  const [paycheckPlan, setPaycheckPlan] = useState<PaycheckPlanItem[]>([]);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const profileString = await AsyncStorage.getItem("userProfile");
          const billString = await AsyncStorage.getItem("userBills");

          const profile: UserProfile | null = profileString
            ? JSON.parse(profileString)
            : null;
          const bills: Bill[] = billString ? JSON.parse(billString) : [];
          setUserProfile(profile);
          setBills(bills);

          if (profile && bills.length > 0) {
            const oldPlanString = await AsyncStorage.getItem("paycheckPlan");
            const oldPlan: PaycheckPlanItem[] = oldPlanString
              ? JSON.parse(oldPlanString)
              : [];

            const newPlan = calculatePaycheckPlan(profile.payFrequency, bills);

            const mergedPlan = newPlan.map((newItem) => {
              const oldItem = oldPlan.find(
                (item) => item.billId === newItem.billId
              );

              if (oldItem) {
                return { ...newItem, isSaved: oldItem.isSaved };
              }
              return newItem;
            });

            setPaycheckPlan(mergedPlan);

            await AsyncStorage.setItem(
              "paycheckPlan",
              JSON.stringify(mergedPlan)
            );
          } else if (profile && bills.length === 0) {
            setPaycheckPlan([]);
            await AsyncStorage.removeItem("paycheckPlan");
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
      const user = getAuth().currentUser;
      if(!user) {
        throw new Error("No user logged in.");
      }
      const uid = user.uid;
      const db = getFirestore();
      const userDocRef = doc(db, "users", uid)
      await setDoc(userDocRef, profile);
      setUserProfile(profile)
    } catch (e) {
      console.error("Failed to save profile", e);
      Alert.alert("Error", "Could not save your profile");
    }
  };

  const handleMarkAsSaved = async (billId: string) => {
    try {
      const updatedPlan = paycheckPlan.map((item) =>
        item.billId === billId ? { ...item, isSaved: !item.isSaved } : item
      );

      setPaycheckPlan(updatedPlan);

      await AsyncStorage.setItem("paycheckPlan", JSON.stringify(updatedPlan));
    } catch (e) {
      console.error("Failed to save plan", e);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const auth = getAuth();
      await signOut(auth);
      await GoogleSignin.signOut();
    } catch (error: any) {
      Alert.alert("Sign Out Error", error.message);
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  // State 1, user has no profile set up
  if (!userProfile) {
    const userName = getAuth().currentUser?.displayName || 'User';
    return <SetupForm onSave={handleSaveProfile} userNameFromGoogle={userName}/>;
  }

  const formattedSalary = new Intl.NumberFormat().format(userProfile.salary);

  const totalToSetAside = paycheckPlan.reduce(
    (sum, item) => sum + item.amountToSetAside,
    0
  );
  const totalSaved = paycheckPlan.reduce(
    (sum, item) => (item.isSaved ? sum + item.amountToSetAside : sum),
    0
  );
  const freeToSpend = userProfile.salary - totalToSetAside;

  // State 2: user has profile but no bills
  if (userBills.length === 0) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Pressable
            style={styles.signOutButton}
            onPress={handleSignOut}
            disabled={isSigningOut}
          >
            <Text style={styles.signOutButtonText}>
              {isSigningOut ? "Signing Out..." : "Sign Out"}
            </Text>
          </Pressable>
        </View>
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
      </ScrollView>
    );
  }

  // State 3: user has profile and bills
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          <Text style={styles.signOutButtonText}>
            {isSigningOut ? "Signing Out..." : "Sign Out"}
          </Text>
        </Pressable>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.title}>{userProfile.name}</Text>
        <Text style={styles.subtitle}>Paycheck: ${formattedSalary}</Text>
        <Text style={styles.subtitle}>
          Frequency: {userProfile.payFrequency}
        </Text>
        <Text style={styles.subtitle}>
          You have {userBills.length} monthly bills.
        </Text>
        <Text style={styles.subtitle}>Set this aside from your paycheck:</Text>
      </View>

      {paycheckPlan.map((item) => (
        <Pressable
          key={item.billId}
          style={[styles.billItem, item.isSaved && styles.billItemSaved]}
          onPress={() => handleMarkAsSaved(item.billId)}
        >
          <View>
            <Text
              style={[styles.billName, item.isSaved && styles.billNameSaved]}
            >
              {item.name}
            </Text>
            <Text
              style={[
                styles.billAmount,
                item.isSaved && styles.billAmountSaved,
              ]}
            >
              ${item.totalAmount.toFixed(2)}
            </Text>
            <Text style={styles.summaryLabel}>Set Aside Every Week:</Text>
            <Text style={styles.summaryValue}>
              ${item.amountToSetAside.toFixed(2)}
            </Text>
            <Text style={styles.summaryLabel}>Due Day:</Text>
            <Text style={styles.summaryValue}>{item.dueDay}</Text>
          </View>
          <Text style={styles.checkIcon}>{item.isSaved ? "🔒" : "🔓"}</Text>
        </Pressable>
      ))}

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Paycheck Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Set Aside:</Text>
          <Text style={styles.summaryValue}>
            ${totalSaved.toFixed(2)} / ${totalToSetAside.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>
            Free to Spend {userProfile.payFrequency}
          </Text>
          <Text style={[styles.summaryValue, styles.freeToSpend]}>
            ${freeToSpend.toFixed(2)}
          </Text>
        </View>
      </View>

      <Link href="/modal" asChild>
        <Pressable style={styles.addMoreButton}>
          <Text style={styles.addMoreButtonText}>+ Add Another Bill</Text>
        </Pressable>
      </Link>
    </ScrollView>
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
    backgroundColor: "#007AFF",
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
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  billItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  billItemSaved: {
    backgroundColor: "#e8f5e9",
    opacity: 0.7,
  },
  billName: {
    fontSize: 18,
    fontWeight: "600",
  },
  billNameSaved: {
    textDecorationLine: "line-through",
    color: "#555",
  },
  billAmount: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "700",
    marginTop: 4,
  },
  billAmountSaved: {
    color: "#555",
  },
  checkIcon: {
    fontSize: 24,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#333",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  freeToSpend: {
    color: "#34C759",
  },
  addMoreButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 16,
    marginBottom: 40,
  },
  addMoreButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signOutButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 20
  },
  signOutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
