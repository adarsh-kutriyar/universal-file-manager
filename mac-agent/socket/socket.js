import axios from "axios";
import { io } from "socket.io-client";
import crypto from "crypto";
import os from "os";

import {
  SERVER_URL,
  firebaseUid,
  deviceId,
  deviceName,
  HTTP_PORT,
} from "../config/config.js";

import {
  listRootFolders,
  listFolder,
} from "../services/fileService.js";

import {
  createToken,
} from "../services/tokenService.js";

function getLocalIP() {

  const interfaces =
    os.networkInterfaces();

  for (const name in interfaces) {

    for (const net of interfaces[name]) {

      if (
        net.family === "IPv4" &&
        !net.internal
      ) {

        return net.address;

      }

    }

  }

  return "127.0.0.1";

}

export default async function startSocket() {

  await axios.post(
    `${SERVER_URL}/api/device/register`,
    {
      firebaseUid,
      deviceId,
      deviceName,
      platform: "macos",
    }
  );

  console.log("Device Registered");

  const socket = io(SERVER_URL);

  socket.on(
    "connect",
    () => {

      console.log(
        "Socket Connected:",
        socket.id
      );

      socket.emit(
        "device-online",
        {
          deviceId,
        }
      );

    }
  );

  // =====================
  // ROOT FOLDERS
  // =====================

  socket.on(
    "list-root-folders",
    ({ requestId }) => {

      socket.emit(
        "root-folders-response",
        {
          requestId,
          folders:
            listRootFolders(),
        }
      );

    }
  );

  // =====================
  // LIST FOLDER
  // =====================

  socket.on(
    "list-folder",
    ({
      requestId,
      path,
    }) => {

      socket.emit(
        "folder-response",
        {
          requestId,
          items:
            listFolder(path),
        }
      );

    }
  );

  // =====================
  // READ FILE
  // =====================

  socket.on(
    "read-file",
    ({
      requestId,
      path,
    }) => {

      const token =
        crypto.randomUUID();

      createToken(
        token,
        path
      );

      const url =
        `http://${getLocalIP()}:${HTTP_PORT}/download/${token}`;

        console.log("Generated URL:", url);
        console.log("Token:", token);

      socket.emit(
        "file-response",
        {
          requestId,
          fileName:
            path
              .split("/")
              .pop(),
          downloadUrl:
            url,
        }
      );

      console.log(
        "Download URL:",
        url
      );

    }
  );

    // =====================
  // CREATE STREAM
  // =====================

  socket.on(
    "create-stream",
    ({
      requestId,
      path,
    }) => {

      const token =
        crypto.randomUUID();

      createToken(
        token,
        path
      );

      const url =
        `http://${getLocalIP()}:${HTTP_PORT}/video/${token}`;

      console.log(
        "Generated Stream URL:",
        url
      );

      socket.emit(
        "stream-response",
        {
          requestId,
          fileName:
            path
              .split("/")
              .pop(),
          streamUrl:
            url,
        }
      );

    }
  );

}


