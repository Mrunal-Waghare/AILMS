import User from "../model/UserModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import sendMail from "../config/sendMail.js";


// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long"
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role
    });

    const token = genToken(user._id);

    // ✅ FIXED COOKIE SETTINGS
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,        // keep false for localhost
      sameSite: "Lax",      // 🔥 IMPORTANT FIX (was Strict)
      //maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: _, ...userData } = user._doc;
    return res.status(201).json(userData);

  } catch (error) {
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};


// ================= LOGIN =================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = genToken(user._id);

    // ✅ FIXED COOKIE SETTINGS
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",   // 🔥 IMPORTANT FIX
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password: _, ...userData } = user._doc;
    return res.status(200).json(userData);

  } catch (error) {
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};


// ================= LOGOUT =================
export const logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(200).json({ message: "Logout successfully" });

  } catch (error) {
    return res.status(500).json({ message: `Logout error: ${error}` });
  }
};


// ================= SEND OTP =================
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.status(200).json({ message: "OTP sent to your email" });

  } catch (error) {
    return res.status(500).json({ message: "Error sending OTP: " + error.message });
  }
};


// ================= VERIFY OTP =================
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP: " + error.message });
  }
};


// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerified) {
      return res.status(404).json({
        message: "User not found or OTP not verified"
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    user.isOtpVerified = false;

    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Error resetting password: " + error.message });
  }
};


// ================= GOOGLE AUTH =================
export const googleAuth = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        role
      });
    }

    const token = genToken(user._id);

    // ✅ FIXED COOKIE SETTINGS
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",   // 🔥 IMPORTANT FIX
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { password, ...userData } = user._doc;

    return res.status(200).json(userData);

  } catch (error) {
    return res.status(500).json({
      message: `Google auth error: ${error.message}`
    });
  }
};