# Overview

As a developer, I'm always looking to expand my skills from the web to other platforms. This project represents my first step into mobile development, applying my existing knowledge of React to the React Native ecosystem.

This software is a proactive paycheck planner app, designed to help users budget their salary. The app's core feature is a "Paycheck Checklist," which is automatically calculated based on the user's pay frequency and their list of monthly bills. It shows the user exactly how much money to set aside from each paycheck to cover all their bills.

The purpose of this specific module was to build the app's complete local functionality. This involved setting up the Expo dev environment and building a robust, multi-state user flow managed by React Hooks. The app's workflow includes:

1.  **Onboarding:** A one-time tutorial for new users, managed by checking `AsyncStorage`.
2.  **State 1 (Profile Setup):** A "smart" dashboard that prompts new users to fill out a `SetupForm` component to save their name, salary, and pay frequency.
3.  **State 2 (Add Bills):** After the profile is saved, the dashboard prompts the user to add their first bill using a modal.
4.  **State 3 (Paycheck Checklist):** The main dashboard displays the full, interactive checklist. Users can tap each bill to mark it as "saved" (🔒/🔓).
5.  **Smart Data Syncing:** The dashboard uses the `useFocusEffect` hook to load all data from `AsyncStorage` every time the screen is viewed. This ensures that when a new bill is added, the "Paycheck Checklist" is automatically regenerated using a "smart merge" logic that preserves the user's existing checkmarks.

[Software Demo Video](I will add the link before November 8, 2025)

# Development Environment

* **IDE:** Visual Studio Code
* **Framework:** React Native (with Expo)
* **Testing:** Android Studio (Emulator) & Expo Go (for iOS device)
* **Package Manager:** `pnpm`
* **Version Control:** Git / GitHub
* **Navigation:** **Expo Router** (File-based navigation)
* **State Management:** React Hooks (`useState`, `useCallback`, `useFocusEffect`)
* **Local Storage:** `AsyncStorage` (for persisting all user data)
* **Architecture:**
    * Refactored all business logic (the "calculator") into a `utils/planCalculator.ts` file.
    * Centralized all data models (`UserProfile`, `Bill`, `PaycheckPlanItem`) in `constants/types.ts`.
    * Reusable UI (like `SetupForm`) was extracted into the `components/` folder.

The app is written in **TypeScript (TSX)**.

# Useful Websites

* [Expo Documentation](https://docs.expo.dev/)
* [Expo Router Documentation](https://docs.expo.dev/router/overview/)
* [React Navigation Docs](https://reactnavigation.org/)
* [React Native - AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)