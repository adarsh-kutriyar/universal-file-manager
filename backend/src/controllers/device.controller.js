import Device from "../models/Device.js";

export const registerDevice =
  async (req, res) => {
    try {

      const {
        firebaseUid,
        deviceId,
        deviceName,
        platform,
      } = req.body;

      const device =
        await Device.findOneAndUpdate(
          { 
            firebaseUid,
            deviceId },

          {
            firebaseUid,
            deviceName,
            platform,
            online: true,
            lastSeen: new Date(),
          },

          {
            new: true,
            upsert: true,
          }
        );

      res.status(200).json(device);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  };


  export const getUserDevices =
  async (req, res) => {
    try {

      const devices =
        await Device.find({
          firebaseUid:
            req.params.firebaseUid,
        });

      res.status(200).json(
        devices
      );

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  };