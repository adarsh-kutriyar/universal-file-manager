import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import socket from "../socket/socket";

export default function MacFoldersScreen({
  route,
  navigation,
}) {

  const { device } = route.params;

  const [folders, setFolders] =
    useState([]);

  useEffect(() => {

    loadRootFolders();

  }, []);

  const loadRootFolders = () => {

    const requestId =
      Date.now().toString();

    socket.emit(
      "request-root-folders",
      {
        targetDeviceId:
          device.deviceId,
        requestId,
      }
    );

    socket.once(
      "root-folders-response",
      ({
        requestId: returnedRequestId,
        folders,
      }) => {

        if (
          returnedRequestId === requestId
        ) {

          console.log(folders);

          setFolders(folders);

        }

      }
    );

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

      <FlatList
        data={folders}
        keyExtractor={(item) =>
          item.path
        }
        renderItem={({ item }) => (

          <TouchableOpacity
            onPress={() => {

              navigation.navigate(
                "MacFolder",
                {
                  device,
                  path: item.path,
                  title: item.name,
                }
              );

            }}
            style={{
              padding: 15,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >

            <Text>
              📁 {item.name}
            </Text>

          </TouchableOpacity>

        )}
      />

    </View>

  );

}