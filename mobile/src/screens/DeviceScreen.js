import React, {
  useEffect,
  useState,
} from "react";

import RNFS from "react-native-fs";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";

export default function DeviceScreen({
  route,
  navigation,
}) {
  const {
    device,
    currentDeviceId,
  } = route.params;

  const [files, setFiles] =
    useState([]);

  const isCurrentDevice =
    device.deviceId === currentDeviceId;

  

  const requestStoragePermission = async () => {

  if (Platform.OS !== "android") {
    return true;
  }

  try {

    if (Platform.Version >= 33) {

      const result =
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ]);

      return true;

    } else {

      const granted =
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );

      return (
        granted ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    }

  } catch (error) {

    console.log(error);

    return false;
  }
};

useEffect(() => {

  const init = async () => {

    const granted =
      await requestStoragePermission();

    if (granted && isCurrentDevice) {

      loadFiles();

    } else {

      console.log(
        "Storage permission denied"
      );
    }
  };

  init();

}, []);

  const loadFiles = async () => {
    try {
      const result =
        await RNFS.readDir(
          RNFS.ExternalStorageDirectoryPath
        );

      setFiles(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        {device.deviceName}
      </Text>

      <Text
        style={{
          marginBottom: 20,
        }}
      >
        {isCurrentDevice
          ? "Current Device"
          : "Remote Device"}
      </Text>

      {isCurrentDevice && (
        <FlatList
          data={files}
          keyExtractor={(item) =>
            item.path
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(
                  "Folder",
                  {
                    path: item.path,
                    title: item.name,
                  }
                )
              }
              style={{
                padding: 15,
                borderWidth: 1,
                marginBottom: 10,
                borderRadius: 10,
              }}
            >
              <Text>
                {item.isDirectory()
                  ? "📁 "
                  : "📄 "}
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {!isCurrentDevice && (
        <Text>
          Remote device browsing
          coming next...
        </Text>
      )}
    </View>
  );
}