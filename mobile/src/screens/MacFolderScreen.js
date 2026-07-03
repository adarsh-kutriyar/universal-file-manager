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
import { downloadFile } from "../services/TransferService";

export default function MacFolderScreen({
  route,
  navigation,
}) {

  const {
    device,
    path,
    title,
  } = route.params;

  const [items, setItems] =
    useState([]);

  useEffect(() => {

    const requestId =
      Date.now().toString();

    socket.emit(
      "request-folder",
      {
        targetDeviceId:
          device.deviceId,
        requestId,
        path,
      }
    );

    socket.once(
      "folder-response",
      ({
        requestId: returnedRequestId,
        items,
      }) => {

        if (
          returnedRequestId === requestId
        ) {

          setItems(items);

        }

      }
    );

  }, []);

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
        {title}
      </Text>

      <FlatList
        data={items}
        keyExtractor={(item) =>
          item.path
        }
        renderItem={({ item }) => (

          <TouchableOpacity

            onPress={async () => {

              if (
                item.isDirectory
              ) {

                navigation.push(
                  "MacFolder",
                  {
                    device,
                    path: item.path,
                    title: item.name,
                  }
                );

              } else {

                try {

                  navigation.navigate(
                    "FileViewer",
                    {
                      device,
                      file: item,
                    }
                  );

                } catch (error) {

                  console.log(error);

                }

              }

            }}

            style={{
              padding: 15,
              borderWidth: 1,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >

            <Text>

              {item.isDirectory
                ? "📁 "
                : "📄 "}

              {item.name}

            </Text>

          </TouchableOpacity>

        )}
      />

    </View>

  );

}