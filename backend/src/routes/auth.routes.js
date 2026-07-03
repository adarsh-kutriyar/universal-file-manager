import express from "express";
import {registerUser,getUser} from "../controllers/auth.controller.js";


const router = express.Router();

router.post(
  "/register",
  registerUser
);

router.get(
  "/user/:firebaseUid",
  getUser
);

export default router;