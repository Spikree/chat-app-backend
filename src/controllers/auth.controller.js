import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: "Password must be atleast 6 characters",
    });
  }
  try {
    const user = await User.findOne({
      email: email,
    });

    if (user) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email,
      fullName: fullName,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All the fields are requireddd",
    });
  }
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller : ", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out sucessfully",
    });
  } catch (error) {
    console.log("Error in logout controller");
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
