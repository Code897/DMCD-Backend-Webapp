import chalk from "chalk";
import { User, Driver } from "../db/models/schema.js";

const postDriver = async (name, phone) => {
  try {
    const user = await User.findOne({ phone });
    if(user.usertype==="DRIVER"){
      throw new Error("Already a driver");
    }
    if (user) {
      user.usertype = "DRIVER";
      await user.save();

      const driverData = {
        _id:user._id,
        name: name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        usertype: "DRIVER",
        city: user.city,
        religion: user.religion,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      };

      const driver = new Driver(driverData);
      await driver.save();
      return driver;
    } else {
      console.log("User not found with phone number:", phone);
      return null;
    }
  } catch (error) {
    console.error("Error creating driver:", error);
    throw error;
  }
};

export {postDriver}