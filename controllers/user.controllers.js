import { User } from "../model/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const GetUser = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching user",
    });
  }
};

const RegisterUser = async (req, res) => {
  try {
    const { name, email, password, tc } = req.body;
    if (!name?.trim() || !email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please Fill All Fields",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Email Already Registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tc,
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successfull",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in registration",
    });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please Fill All Fields",
      });
    }

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(200).json({
        success: false,
        message: "No Such Account Found",
      });
    }

    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = await jwt.sign(
      { id: userExist._id, email: userExist.email },
      process.env.JSON_WEB_TOKEN,
      { expiresIn: "7d" }
    );

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Error while generating token",
      });
    }

    const user = await User.findByIdAndUpdate(
      userExist._id,
      {
        $set: { token },
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Error while generating token",
      });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login Successfull",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while login",
    });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword?.trim() || !newPassword?.trim()) {
      return res.status(401).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findById(req.user?._id);

    const isOldPasswordwordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordwordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Old Password Incorrect",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(401).json({
        success: false,
        message: "New Password same as old, change something",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    user.password = hashedPass;
    user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while Changing Password",
    });
  }
};

export { RegisterUser, LoginUser, GetUser, ChangePassword };
