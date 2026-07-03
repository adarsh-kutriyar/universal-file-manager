import express from "express";
import {
  registerDevice,
  getUserDevices,
} from "../controllers/device.controller.js";


const router = express.Router();

router.post(
  "/register",
  registerDevice
);

router.get(
  "/:firebaseUid",
  getUserDevices
);

export default router;