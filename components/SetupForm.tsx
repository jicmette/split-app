import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { UserProfile } from '../constants/types';

const FREQUENCIES = ['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly'];

export default function SetupForm({ onSave, userNameFromGoogle, }: { onSave: (profile: UserProfile) => void; userNameFromGoogle: string; }) {
  const [name, setName] = useState(userNameFromGoogle);
  const [salary, setSalary] = useState('');
  const [payFrequency, setPayFrequency] = useState<'Weekly' | 'Bi-weekly' | 'Semi-monthly' | 'Monthly' | null>(null);

  const handleSave = () => {
    const numericSalary = parseFloat(salary);
    if (!numericSalary || !payFrequency) {
      alert('Please fill out both fields.');
      return;
    }

    const profile: UserProfile = {
      name: name || 'User',
      salary: numericSalary,
      payFrequency: payFrequency,
    };

    onSave(profile);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.setupContainer}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Lets set up your budget plan.</Text>

          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={name}
            onChangeText={setName}
            editable={false}
          />

          <Text style={styles.label}>What is your salary per paycheck?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 1000"
            keyboardType="numeric"
            value={salary}
            onChangeText={setSalary}
          />

          <Text style={styles.label}>How often are you paid?</Text>
          <View style={styles.buttonGroup}>
            {FREQUENCIES.map((freq) => (
              <Pressable
                key={freq}
                style={[
                  styles.freqButton,
                  payFrequency === freq && styles.freqButtonSelected,
                ]}
                onPress={() => setPayFrequency(freq as any)}
              >
                <Text
                  style={[
                    styles.freqButtonText,
                    payFrequency === freq && styles.freqButtonTextSelected,
                  ]}
                >
                  {freq}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </Pressable>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  setupContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  freqButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    width: '48%',
    alignItems: 'center',
  },
  freqButtonSelected: {
    backgroundColor: '#007AFF',
  },
  freqButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  freqButtonTextSelected: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#f4f4f4',
    color: '#888',
  },
});