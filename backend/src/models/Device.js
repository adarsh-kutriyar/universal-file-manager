import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    deviceName: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      required: true,
    },

    socketId: {
      type: String,
      default: null,
    },

    online: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Device",
  deviceSchema
);