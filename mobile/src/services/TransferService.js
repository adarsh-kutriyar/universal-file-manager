import RNFS from "react-native-fs";

import socket from "../socket/socket";

// ======================
// DOWNLOAD FILE
// ======================

export async function downloadFile({
  device,
  file,
}) {

  return new Promise((resolve, reject) => {

    const requestId =
      Date.now().toString();

    socket.emit(
      "request-file",
      {
        targetDeviceId:
          device.deviceId,
        requestId,
        path: file.path,
      }
    );

    socket.once(
      "file-response",
      async (data) => {

        try {

          const localPath =
            `${RNFS.CachesDirectoryPath}/${data.fileName}`;

          const result =
            await RNFS.downloadFile({

              fromUrl:
                data.downloadUrl,

              toFile:
                localPath,

            }).promise;

          if (
            result.statusCode === 200
          ) {
            console.log("Received Stream URL:", data.streamUrl);

            resolve({

              localPath,

              fileName:
                data.fileName,

            });

          } else {

            reject(
              "Download Failed"
            );

          }

        } catch (error) {

          reject(error);

        }

      }
    );

  });

}

// ======================
// GET STREAM URL
// ======================

export async function getStreamUrl({
  device,
  file,
}) {

  return new Promise((resolve, reject) => {

    const requestId =
      Date.now().toString();

    socket.emit(
      "request-stream",
      {
        targetDeviceId:
          device.deviceId,
        requestId,
        path: file.path,
      }
    );

    socket.once(
      "stream-response",
      (data) => {

        resolve({

          streamUrl:
            data.streamUrl,

          fileName:
            data.fileName,

        });

      }
    );

  });

}