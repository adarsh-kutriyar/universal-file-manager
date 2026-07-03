import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import api from "../api/api";

export default function HomeScreen({
  firebaseUid, currentDeviceId
}) {

    const navigation = useNavigation();

  const [devices, setDevices] =
    useState([]);

  useEffect(() => {

    fetchDevices();

  }, []);

  const fetchDevices =
    async () => {

      try {

        const response =
          await api.get(
            `/device/${firebaseUid}`
          );

        setDevices(
          response.data
        );

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
        My Devices
      </Text>

      <FlatList
        data={devices}
        keyExtractor={(item) =>
          item._id
        }
        renderItem={({ item }) => (

          <TouchableOpacity
            style={{
                padding: 15,
                marginBottom: 10,
                borderWidth: 1,
                borderRadius: 10,
            }}
            onPress={() => {

              if (item.platform === "macos") {

                  navigation.navigate(
                      "MacFolders",
                      {
                          device: item,
                      }
                  );

              } else {

                  navigation.navigate(
                      "Device",
                      {
                          device: item,
                          currentDeviceId,
                      }
                  );

              }

          }}
            >

            <Text>
              {item.deviceName}
            </Text>

            <Text>
              {item.platform}
            </Text>

            <Text>
              {item.online
                ? "🟢 Online"
                : "⚫ Offline"}
            </Text>

          </TouchableOpacity>

        )}
      />

    </View>
  );
}