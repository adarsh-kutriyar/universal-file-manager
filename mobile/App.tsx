import React, { useState } from "react";
import { Alert } from "react-native";

import auth from "./src/firebase/firebase";
import api from "./src/api/api.js";
import DeviceInfo from "react-native-device-info";

// Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import DeviceScreen from "./src/screens/DeviceScreen";
import FolderScreen from "./src/screens/FolderScreen";
import FileViewerScreen from "./src/screens/FileViewerScreen.js";
import MacFoldersScreen from "./src/screens/MacFoldersScreen";
import MacFolderScreen from "./src/screens/MacFolderScreen.js";

import socket from "./src/socket/socket";


const Stack = createNativeStackNavigator();

export default function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [firebaseUid, setFirebaseUid] = useState(null);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);

  const signup = async () => {

    try {

      const result =
        await auth().signInWithEmailAndPassword(
          "testWEfwe@gmasdzdsil.com",
          "123adcaefa45678"
        );

      const deviceId =
        await DeviceInfo.getUniqueId();

      setCurrentDeviceId(deviceId);

      const deviceName =
        await DeviceInfo.getDeviceName();

      const platform = "android";

      await api.post(
        "/auth/register",
        {
          firebaseUid: result.user.uid,
          email: result.user.email,
        }
      );

      await api.post(
        "/device/register",
        {
          firebaseUid: result.user.uid,
          deviceId,
          deviceName,
          platform,
        }
      );

      console.log("Login Success");

      setFirebaseUid(result.user.uid);

      socket.emit(
        "device-online",
        {
          deviceId,
        }
      );

      setLoggedIn(true);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        error.message
      );

    }

  };

  return (

    <NavigationContainer>

      <Stack.Navigator>

        {!loggedIn ? (

          <Stack.Screen name="Login">
            {() => (
              <LoginScreen
                onLogin={signup}
              />
            )}
          </Stack.Screen>

        ) : (

          <>

            <Stack.Screen name="Home">
              {() => (
                <HomeScreen
                  firebaseUid={firebaseUid}
                  currentDeviceId={currentDeviceId}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Device"
              component={DeviceScreen}
            />

            <Stack.Screen
              name="Folder"
              component={FolderScreen}
            />

            <Stack.Screen
              name="FileViewer"
              component={FileViewerScreen}
            />

            <Stack.Screen
              name="MacFolders"
              component={MacFoldersScreen}
            />

            {/* NEW SCREEN */}
            <Stack.Screen
              name="MacFolder"
              component={MacFolderScreen}
            />

          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>

  );

}