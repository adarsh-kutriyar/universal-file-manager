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

import RNFS from "react-native-fs";

export default function FolderScreen({
  route,
  navigation,
}) {
  const { path, title } = route.params;

  const [files, setFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, [path]);

  const loadFiles = async () => {
    try {
      console.log("OPENING:", path);

      const result =
        await RNFS.readDir(path);

      console.log(
        "FILES COUNT:",
        result.length
      );

      console.log(result);

      setFiles(result);

    } catch (error) {
      console.log(
        "ERROR:",
        error
      );
    }
  };

  console.log(
    "RENDERING:",
    files.length
  );

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

      <Text
        style={{
          marginBottom: 20,
          fontSize: 16,
        }}
      >
        Files Found: {files.length}
      </Text>

      <FlatList
        data={files}
        extraData={files}
        keyExtractor={(item) =>
          item.path
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {

              console.log(
                "CLICKED:",
                item.name,
                item.path
              );

            if (item.isDirectory()) {

                navigation.push(
                    "Folder",
                    {
                    path: item.path,
                    title: item.name,
                    }
                );

                } else {

                navigation.navigate(
                    "Image",
                    {
                    path: item.path,
                    title: item.name,
                    }
                );

                }
            }}
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
    </View>
  );
}