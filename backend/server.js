

import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/db/connectDB.js";

import { createServer } from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import deviceRoutes from "./src/routes/device.routes.js";

dotenv.config();

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// ======================
// SOCKET STORAGE
// ======================

const connectedDevices = {};
const pendingRequests = {};

// ======================

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/device", deviceRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("Backend Running");
});

io.on("connection", (socket) => {

  console.log(
    "Socket Connected:",
    socket.id
  );

  // ======================
  // DEVICE ONLINE
  // ======================

  socket.on(
    "device-online",
    ({ deviceId }) => {

      connectedDevices[deviceId] =
        socket.id;

      console.log(
        deviceId,
        "ONLINE"
      );

    }
  );

  // ======================
  // REQUEST ROOT FOLDERS
  // ======================

  socket.on(
    "request-root-folders",
    ({
      targetDeviceId,
      requestId,
    }) => {

      const targetSocketId =
        connectedDevices[targetDeviceId];

      if (!targetSocketId) {
        return;
      }

      pendingRequests[
        requestId
      ] = socket.id;

      io.to(
        targetSocketId
      ).emit(
        "list-root-folders",
        {
          requestId,
        }
      );

    }
  );

  // ======================
  // REQUEST FOLDER
  // ======================

  socket.on(
    "request-folder",
    ({
      targetDeviceId,
      requestId,
      path,
    }) => {

      const targetSocketId =
        connectedDevices[targetDeviceId];

      if (!targetSocketId) {
        return;
      }

      pendingRequests[
        requestId
      ] = socket.id;

      io.to(
        targetSocketId
      ).emit(
        "list-folder",
        {
          requestId,
          path,
        }
      );

    }
  );

  // ======================
  // REQUEST FILE
  // ======================

  socket.on(
    "request-file",
    ({
      targetDeviceId,
      requestId,
      path,
    }) => {

      const targetSocketId =
        connectedDevices[targetDeviceId];

      if (!targetSocketId) {
        return;
      }

      pendingRequests[
        requestId
      ] = socket.id;

      io.to(
        targetSocketId
      ).emit(
        "read-file",
        {
          requestId,
          path,
        }
      );

    }
  );

  // ======================
// REQUEST STREAM
// ======================

socket.on(
  "request-stream",
  ({
    targetDeviceId,
    requestId,
    path,
  }) => {

    const targetSocketId =
      connectedDevices[targetDeviceId];

    if (!targetSocketId) {
      return;
    }

    pendingRequests[
      requestId
    ] = socket.id;

    io.to(
      targetSocketId
    ).emit(
      "create-stream",
      {
        requestId,
        path,
      }
    );

  }
);

    // ======================
  // ROOT FOLDER RESPONSE
  // ======================

  socket.on(
    "root-folders-response",
    ({
      requestId,
      folders,
    }) => {

      const requesterSocket =
        pendingRequests[
          requestId
        ];

      if (!requesterSocket) {
        return;
      }

      io.to(
        requesterSocket
      ).emit(
        "root-folders-response",
        {
          requestId,
          folders,
        }
      );

      delete pendingRequests[
        requestId
      ];

    }
  );

  // ======================
  // FOLDER RESPONSE
  // ======================

  socket.on(
    "folder-response",
    ({
      requestId,
      items,
    }) => {

      const requesterSocket =
        pendingRequests[
          requestId
        ];

      if (!requesterSocket) {
        return;
      }

      io.to(
        requesterSocket
      ).emit(
        "folder-response",
        {
          requestId,
          items,
        }
      );

      delete pendingRequests[
        requestId
      ];

    }
  );

  // ======================
  // FILE RESPONSE
  // ======================

  socket.on(
    "file-response",
    (data) => {

      const requesterSocket =
        pendingRequests[
          data.requestId
        ];

      if (!requesterSocket) {
        return;
      }

      io.to(
        requesterSocket
      ).emit(
        "file-response",
        data
      );

      delete pendingRequests[
        data.requestId
      ];

    }
  );

  // ======================
// STREAM RESPONSE
// ======================

socket.on(
  "stream-response",
  (data) => {

    const requesterSocket =
      pendingRequests[
        data.requestId
      ];

    if (!requesterSocket) {
      return;
    }

    io.to(
      requesterSocket
    ).emit(
      "stream-response",
      data
    );

    delete pendingRequests[
      data.requestId
    ];

  }
);

  // ======================
  // DISCONNECT
  // ======================

  socket.on(
    "disconnect",
    () => {

      console.log(
        "Socket Disconnected:",
        socket.id
      );

      for (const deviceId in connectedDevices) {

        if (
          connectedDevices[
            deviceId
          ] === socket.id
        ) {

          delete connectedDevices[
            deviceId
          ];

          console.log(
            deviceId,
            "OFFLINE"
          );

        }

      }

    }
  );

});

const PORT =
  process.env.PORT || 8000;

httpServer.listen(
  PORT,
  () => {

    console.log(
      `Server running on ${PORT}`
    );

  }
);






