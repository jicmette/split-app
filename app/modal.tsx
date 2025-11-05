import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Bill } from "../constants/types";

export default function AddBillModal() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDay, setDueDay] = useState("");

  const handleSaveBill = async () => {
    const numericAmount = parseFloat(amount);
    const numericDueDay = parseInt(dueDay, 10);
    if (
      !name ||
      !numericAmount ||
      numericAmount <= 0 ||
      !numericDueDay ||
      numericDueDay <= 0 ||
      numericDueDay > 31
    ) {
      Alert.alert(
        "Error",
        "Please enter a valid name, amount and a due day (1-31)."
      );
      return;
    }

    const newBill: Bill = {
      id: new Date().getTime().toString(),
      name: name,
      amount: numericAmount,
      dueDay: numericDueDay,
    };

    try {
      const existingBillsString = await AsyncStorage.getItem("userBills");
      const existingBills: Bill[] = existingBillsString
        ? JSON.parse(existingBillsString)
        : [];

      const updatedBills = [...existingBills, newBill];

      await AsyncStorage.setItem("userBills", JSON.stringify(updatedBills));

      if (router.canGoBack()) {
        router.back();
      }
    } catch (e) {
      console.error("Failed to save bill", e);
      Alert.alert("Error", "Failed to save bill.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.keyboardAvoidingContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Bill Details</Text>

          <Text style={styles.label}>Bill Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Rent, Internet, Car Insurance"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Monthly Amount ($)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1000"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Due Day</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1"
            keyboardType="numeric"
            value={dueDay}
            onChangeText={setDueDay}
          />

          <Pressable style={styles.saveButton} onPress={handleSaveBill}>
            <Text style={styles.saveButtonText}>Save Bill</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: "#333",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
