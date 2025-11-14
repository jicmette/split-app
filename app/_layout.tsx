import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { SplashScreen, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const flag = await AsyncStorage.getItem("hasCompletedOnboarding");

          if (flag === "true") {
            router.replace("/(tabs)");
          } else {
            router.replace("/login");
          }
        } else {
          router.replace("/onboarding");
        }
      } catch (error) {
        console.error("Failed to check user status", error);
        router.replace("/login");
      } finally {
        SplashScreen.hideAsync();
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "Add New Bill" }}
      />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}
