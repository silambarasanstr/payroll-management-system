import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("Connected Register");
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while registering user",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  console.log("Connected Login");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const match = await bcrypt.compare(password, user.password);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while logging in",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  console.log("Connected Profile");
  try {
    const user = await User.findById("6a4a73037e8cf7621351eec3").select("-password");
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occurred while retrieving profile",
      error: error.message,
    });
  }
};
