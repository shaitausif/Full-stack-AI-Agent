import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Ticket from "../models/ticket.model.js";
import { inngest } from "../inngest/client.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendForgotPasswordEmail } from "../helpers/sendForgotPasswordEmail.js";

// I am actually not using those wrapper function asyncHandler as i had used it in one of my backend project so here instead of it i will use trycatch everywhere
export const signUp = async (req, res) => {
  const { email, password, skills = [] } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const isUserExists = await User.findOne({ email });
    if (isUserExists) throw new Error("User already Exists");

    const createdUser = await User.create({
      email,
      password: hashedPassword,
      skills,
    });

    const user = await User.findById(createdUser._id).select("-password");

    // Fire inngest events like sending mail to the user for signing up successfully

    await inngest.send({
      // name of the event
      name: "user/signup",
      data: {
        userId: user._id,
      },
    });

    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn : '7d'
      }
    );

    const options = {
      httpOnly: false,
      secure: true,
      maxAge: 3600000 * 24 * 7,
      sameSite: "none",
    };

    res
      .status(200)
      .cookie("accessToken", token, options)
      .json(new ApiResponse(200, { user, token }, "Signup successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, {}, `Signup Failed: ${error.message}`));
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword)
      return res
        .status(401)
        .json(new ApiResponse(401, {}, "Invalid Credentials"));

    const token = jwt.sign(
      { _id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn : '7d'
      }
    );
    // Here, for this application I am verifying the user only with the single token which is the access token
    // so to make the cookie unmodifiable from the front-end we use few options
    const options = {
      httpOnly: false,
      secure: true,
      maxAge: 3600000 * 24 * 7,
      sameSite: "none",
    };
    res
      .status(200)
      .cookie("accessToken", token, options)
      .json(new ApiResponse(200, { user, token }, "Login Successful"));

     
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, {}`Login Failed: ${error.message}`));
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(200).json(new ApiResponse(200, {}, "No token found"));
    }

    res.clearCookie("accessToken", {
      httpOnly: false,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, {}, `Logout Failed: ${error.message}`));
  }
};

export const updateUser = async (req, res) => {
  // So in this controller we'll only give the authority to the admin to update the skills and role
  const { skills = [], role, email } = req.body;

  try {
    // Only admin and moderator can update their skills and profiles
    if (req.user?.role !== "admin") {
      return res.status(401).json(new ApiResponse(401, {}, "Forbidden"));
    }

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).status(new ApiResponse(404, {}, "User not found"));

    await User.updateOne(
      { email },
      { role, skills: skills.length ? skills : user.skills }
    );

    res.status(200).json(new ApiResponse(200, {}, "User updated successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, {}, `Update Failed: ${error.message}`));
  }
};

export const getUsers = async (req, res) => {
  try {
    // Here in this function i will only give access to the admin and moderator to get all the users
    if (req.user?.role !== "admin") {
      return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
    }

    const users = await User.find().select("-password");
    res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiResponse(500, {}, `Failed to get Users: ${error.message}`));
  }
};

// controller for searching the user on the basis of their email
export const searchUser = async (req, res) => {
  try {
    const { email } = req.params;
    const users = await User.find({
      email: {
        $regex: email,
        $options: "i",
      },
    }).select("email role skills");
    if (!users)
      return res.status(404).json(new ApiResponse(404, {}, "No user found"));

    return res.status(200).json(new ApiResponse(200, users, "Users found"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Failed to fetch the user's data"));
  }
};

export const authenticateUser = async (req, res) => {
  return res.status(200).json({ authenticated: true, user: req.user });
};

// Get the logged-in user's profile along with ticket stats
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));

    const [created, assigned, closed] = await Promise.all([
      Ticket.countDocuments({ createdBy: req.user._id }),
      Ticket.countDocuments({ assignedTo: req.user._id }),
      Ticket.countDocuments({ createdBy: req.user._id, status: "closed" }),
    ]);

    return res.status(200).json({
      success: true,
      data: user,
      stats: { created, assigned, closed },
    });
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Failed to fetch profile: ${error.message}`));
  }
};

// Update the logged-in user's profile (name, phone, location, bio only)
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, location, bio } = req.body;

    // Validation
    if (name && name.length > 50)
      return res.status(400).json({ success: false, message: "Name must be 50 characters or less" });
    if (phone && phone.length > 20)
      return res.status(400).json({ success: false, message: "Phone must be 20 characters or less" });
    if (location && location.length > 100)
      return res.status(400).json({ success: false, message: "Location must be 100 characters or less" });
    if (bio && bio.length > 300)
      return res.status(400).json({ success: false, message: "Bio must be 300 characters or less" });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(location !== undefined && { location }),
        ...(bio !== undefined && { bio }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json(new ApiResponse(404, {}, "User not found"));

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, {}, `Failed to update profile: ${error.message}`));
  }
};

// Forgot password - sends OTP to email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Email is required"));
    }

    const genericMessage =
      "If an account with that email exists, a password reset OTP has been sent.";

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json(new ApiResponse(200, {}, genericMessage));
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash the OTP before storing
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    // Store hashed OTP and expiry (10 minutes)
    user.resetOtp = hashedOtp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.isOtpVerified = false;
    await user.save();

    // Send OTP via email
    const userName = user.name || user.email.split("@")[0];
    await sendForgotPasswordEmail(user.email, userName, otp);

    return res.status(200).json(new ApiResponse(200, {}, genericMessage));
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong. Please try again later."));
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Email and OTP are required"));
    }

    const user = await User.findOne({ email });

    if (!user || !user.resetOtp || !user.resetOtpExpiry) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid or expired OTP"));
    }

    // Check if OTP has expired
    if (Date.now() > user.resetOtpExpiry) {
      user.resetOtp = null;
      user.resetOtpExpiry = null;
      user.isOtpVerified = false;
      await user.save();
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "OTP has expired. Please request a new one."));
    }

    // Hash the provided OTP and compare
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    if (hashedOtp !== user.resetOtp) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid OTP"));
    }

    // Mark OTP as verified (allow password reset)
    user.isOtpVerified = true;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "OTP verified successfully. You can now reset your password."));
  } catch (error) {
    console.error("Verify OTP error:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong. Please try again later."));
  }
};

// Reset password (after OTP verification)
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Email and new password are required"));
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Password must be at least 6 characters"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Invalid request"));
    }

    // Ensure OTP was verified before allowing password reset
    if (!user.isOtpVerified) {
      return res
        .status(403)
        .json(new ApiResponse(403, {}, "OTP not verified. Please verify your OTP first."));
    }

    // Check if OTP session is still valid (hasn't expired since verification)
    if (!user.resetOtpExpiry || Date.now() > user.resetOtpExpiry.getTime() + 5 * 60 * 1000) {
      user.resetOtp = null;
      user.resetOtpExpiry = null;
      user.isOtpVerified = false;
      await user.save();
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Session expired. Please request a new OTP."));
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpiry = null;
    user.isOtpVerified = false;
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Password reset successfully. You can now login with your new password."));
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Something went wrong. Please try again later."));
  }
};
