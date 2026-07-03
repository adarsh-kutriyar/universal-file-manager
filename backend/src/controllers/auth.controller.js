import User from "../models/User.js";

export const registerUser = async (req,res) => {
  try {
    const {
      firebaseUid,
      email,
    } = req.body;

    const existingUser =
      await User.findOne({
        firebaseUid,
      });

    if (existingUser) {
      return res.status(200).json(
        existingUser
      );
    }

    const user =
      await User.create({
        firebaseUid,
        email,
      });

    res.status(201).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getUser = async (req, res) => {
  try {

    const user = await User.findOne({
      firebaseUid: req.params.firebaseUid,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};