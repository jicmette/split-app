# Split App - Personal Finance Tracker

As a developer, I'm always looking to build scalable, real-world applications. This project represents my progression from a local-only mobile app to a full-stack cloud application.

"Split" is a proactive paycheck planner. It helps users budget their salary by calculating a "Paycheck Checklist," showing exactly how much money to set aside from each paycheck to cover monthly bills.

---

## Module 1: Mobile App Development

### Overview
The purpose of this module was to build the foundational **frontend** and **local functionality** of the app. I focused on mastering the React Native ecosystem, file-based routing, and local data persistence.

**Key Features Implemented:**
1.  **Onboarding Flow:** A one-time tutorial for new users, managed by checking `AsyncStorage`.
2.  **State Machine Dashboard:** A smart UI that guides the user through **Profile Setup** (State 1) and **Adding Bills** (State 2) before showing the main checklist.
3.  **Bills Checklist (State 3):** The core feature that automatically calculates saving amounts based on the user's pay frequency.
4.  **Local Storage:** All user data (profile, bills, and checklist status) was persisted locally on the device using **`AsyncStorage`**.
5.  **Architecture:** I refactored business logic into utility files (like `planCalculator.ts`) and created reusable UI components to keep the codebase clean.

[Software Demo Video - Module 1](https://www.youtube.com/watch?v=efo2IEC0RtQ)

### Development Environment (Module 1)
* **IDE:** Visual Studio Code
* **Framework:** React Native (with Expo)
* **Navigation:** Expo Router
* **Local Storage:** AsyncStorage
* **State Management:** React Hooks (`useState`, `useCallback`, `useFocusEffect`)
* **Testing:** Android Studio (Emulator) & Expo Go (iOS)
* **Language:** TypeScript (TSX)

---

## Module 2: Cloud Databases

### Overview
The purpose of this module was to migrate the app from a local-only solution to a **cloud-connected full-stack application**. I integrated a Backend-as-a-Service (BaaS) to handle secure user authentication and real-time data syncing across devices.

**Key Features Implemented:**
1.  **Authentication:** Implemented OAuth 2.0 with **Google Sign-In** and **Firebase Auth** to securely manage user sessions.
2.  **Cloud Database:** Migrated the entire data layer from `AsyncStorage` to **Cloud Firestore** (NoSQL).
3.  **Data Modeling:** Structured user data into scalable Firestore documents (`users/{uid}`) containing profiles, bill arrays, and checklist plans.
4.  **Full CRUD Operations:** Refactored the app to perform all operations directly in the cloud:
    * **Create:** Adding new bills via a modal.
    * **Read:** Retrieving the user's profile and bills on login.
    * **Update:** Marking checklist items as "saved" (🔒/🔓) updates the cloud database instantly.
    * **Delete:** Permanently removing bills from the Firestore array.

[Software Demo Video - Module 2](https://www.youtube.com/watch?v=rozjEs-1PDE)

### Development Environment (Module 2)
* **Backend:** Google Firebase
    * **Authentication:** Firebase Auth (Google Provider)
    * **Database:** Cloud Firestore
* **Key Libraries:**
    * `@react-native-firebase` (App, Auth, Firestore)
    * `@react-native-google-signin/google-signin`
* **Build Tools:** Expo Development Build (required for native Google Sign-In code)
* **Version Control:** Git / GitHub (Feature branching workflow)

---

## Useful Websites

* [Expo Documentation](https://docs.expo.dev/)
* [React Native Firebase Documentation](https://rnfirebase.io/)
* [Firebase Console](https://console.firebase.google.com/)
* [React Native - AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
* [Firestore Data Modeling Guide](https://firebase.google.com/docs/firestore/manage-data/structure-data)