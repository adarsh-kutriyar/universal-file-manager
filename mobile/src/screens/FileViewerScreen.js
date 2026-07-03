import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  ActivityIndicator,
} from "react-native";

import {
  downloadFile,
  getStreamUrl,
} from "../services/TransferService";

import {
  getViewer,
} from "../utils/ViewerFactory";

export default function FileViewerScreen({
  route,
}) {

  const {
    device,
    file,
  } = route.params;

  const [loading, setLoading] =
    useState(true);

  const [localPath, setLocalPath] =
    useState("");

  const [streamUrl, setStreamUrl] =
    useState("");

  const [fileName, setFileName] =
    useState("");

  useEffect(() => {

    async function loadFile() {

      try {

        const extension =
          file.name
            .split(".")
            .pop()
            .toLowerCase();

        const videoExtensions = [

          "mp4",
          "mkv",
          "mov",
          "avi",
          "webm",
          "m4v",

        ];

        if (
          videoExtensions.includes(
            extension
          )
        ) {

          console.log(
            "Streaming Video..."
          );

          const result =
            await getStreamUrl({

              device,
              file,

            });

          setStreamUrl(
            result.streamUrl
          );

          setFileName(
            result.fileName
          );

        } else {

          console.log(
            "Downloading File..."
          );

          const result =
            await downloadFile({

              device,
              file,

            });

          setLocalPath(
            result.localPath
          );

          setFileName(
            result.fileName
          );

        }

      } catch (error) {

        console.log(error);

      }

      setLoading(false);

    }

    loadFile();

  }, []);

  if (loading) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <ActivityIndicator
          size="large"
        />

      </View>

    );

  }

  return getViewer({

    fileName,

    localPath,

    streamUrl,

  });

}