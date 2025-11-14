import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

GoogleSignin.configure({
  webClientId:
    "339869616031-8b5qmjuoklpquo6h5hn6o6pnimcri4bn.apps.googleusercontent.com",
});

export default function LoginScreen() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const response: any = await GoogleSignin.signIn();

      const idToken = response.data.idToken;

      if (!idToken) {
        throw new Error("Google Sign-In failed: No ID token received.");
      }
      const auth = getAuth();
      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Sign-in Error", error.message);
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.appName}>Split</Text>
      <Text style={styles.subtitle}>Please sign in to start</Text>
      <Pressable
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: "#666",
    marginBottom: 10,
  },
  appName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    color: "#888",
    marginBottom: 60,
  },
  googleButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
