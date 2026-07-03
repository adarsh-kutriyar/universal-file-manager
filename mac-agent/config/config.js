import dotenv from "dotenv";
import os from "os";

dotenv.config();

export const SERVER_URL =
  process.env.SERVER_URL;

export const HTTP_PORT = 5001;

export const firebaseUid =
  "GNc4IidCgHgKsC82gpi3bfcQEYD2";

export const deviceId =
  os.hostname();

export const deviceName =
  "MacBook Air M4";