import jwt from "jsonwebtoken";

// Handles new user registration and initial validation
export const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    if (
      !firstname?.trim() ||
      !lastname?.trim() ||
      !email?.trim() ||
      !password
    ) {
      return res.status(400).json({ message: "All fields required." });
    }

    // Error handling
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }
    // Regular expression enforcing standard secure password parameters
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    const newUser = new User({ firstname, lastname, email, password, role });
    await newUser.save();

    const { password: _, ...userResponse } = newUser.toObject();
    res
      .status(201)
      .json({ message: "User Created Successfully!", user: userResponse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed.", error: error.message });
  }
};

// Verifies credentials and returns a JWT token
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user and check if account is active
    const user = await User.findOne({
      email: email.toLowerCase(),
      isDeleted: false,
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify password using the schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // Respond with token and non-sensitive user data
    const { password: _, ...userResponse } = user.toObject();
    res.status(200).json({
      message: "Login successful.",
      token,
      user: userResponse,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

// Fetches all users who are not soft-deleted
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed.", error: error.message });
  }
};

// Fetches a specific active user by their ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed.", error: error.message });
  }
};

// Updates user profile information while checking email uniqueness
export const updateUserDetails = async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    const targetUserId = req.params.id;
    
    // Protect against ID spoofing: Check the requester (req.user)
    if (req.user.role !== "admin" && req.user.id !== targetUserId) {
      return res.status(403).json({ message: "Unauthorized to modify this profile." });
    }

    // Fetch the current user record to verify existence and compare email states
    const currentUser = await User.findById(targetUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Handle Email Uniqueness Validation cleanly before modifying records
    const updateData = {};
    
    if (email && email.toLowerCase() !== currentUser.email) {
      const emailTaken = await User.findOne({ email: email.toLowerCase() });
      if (emailTaken) {
        return res.status(400).json({ message: "This email address is already registered." });
      }
      updateData.email = email.toLowerCase();
    }

    // Hydrate the update object fields only if values were provided
    if (firstname) updateData.firstname = firstname;
    if (lastname) updateData.lastname = lastname;

    // Fire a single database save operation returning the brand new payload changes
    const updatedUser = await User.findByIdAndUpdate(
      targetUserId,
      { $set: updateData },
      { new: true, runValidators: true } // { new: true } guarantees the updated data is returned back instantly
    );

    // Strip out the password fields safely from the document conversion object
    const userObject = updatedUser.toObject();
    const { password, ...updatedResponse } = userObject;

    res.status(200).json({ 
      message: "Profile updated successfully.", 
      user: updatedResponse 
    });

  } catch (error) {
    res.status(500).json({ message: "Update failed.", error: error.message });
  }
};

// Route handler for secure password modifications
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.params;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required." });
    }

    // Protect against ID spoofing
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized to modify this profile." });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
      });
    }

    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) return res.status(404).json({ message: "User not found." });

    await user.updateUserPassword(currentPassword, newPassword);
    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    if (error.message === "Current password matches incorrectly.") {
      return res.status(401).json({ message: "Incorrect current password." });
    }
    res.status(500).json({ message: "Password update failed.", error: error.message });
  }
};

import fs from 'fs';
import path from 'path';
import User from '../models/User.js';

export const updateAvatar = async (req, res) => {
  try {
    // 1. Guard check: Verify that Multer successfully caught and processed a file
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided." });
    }

    // 2. Guard check: Verify that req.user was populated by your authenticate middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Session payload missing." });
    }

    const userId = req.user.id;

    // 3. Find the targeted user record document
    const user = await User.findById(userId);
    if (!user) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: "User account profile not found." });
    }

    // 4. Housekeeping: Delete old profile pictures safely from static root paths
    if (user.profilePic && user.profilePic.startsWith('/uploads/')) {
      // Reconstruct absolute path safely matching your exact static directory pipeline
      const absoluteOldPath = path.join(process.cwd(), 'public', user.profilePic);
      
      if (fs.existsSync(absoluteOldPath)) {
        try {
          fs.unlinkSync(absoluteOldPath);
        } catch (unlinkErr) {
          console.error("Failed to delete outdated file pointer asset:", unlinkErr);
        }
      }
    }

    // FIXED: Formatted to match your app's standard static directory schema path structure
    const relativeWebPath = `/uploads/${req.file.filename}`;

    // 5. Commit modifications back to MongoDB
    user.profilePic = relativeWebPath;
    await user.save();

    res.status(200).json({
      message: "Avatar processed and uploaded successfully!",
      profilePic: relativeWebPath
    });

  } catch (error) {
    console.error("Critical Profile Picture Sync Crash:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: "Server exception handling image attachment update.", 
      error: error.message 
    });
  }
};

// Performs a soft delete by flipping the isDeleted flag
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Protect against ID spoofing
    if (req.user.role !== "admin" && req.user.id !== id) {
      return res.status(403).json({ message: "Unauthorized to modify this profile." });
    }

    const user = await User.findOne({ _id: id, isDeleted: false });
    if (!user) return res.status(404).json({ message: "User not found." });

    user.isDeleted = true;
    await user.save();
    res.status(200).json({ message: "Account deactivated." });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed.", error: error.message });
  }
};