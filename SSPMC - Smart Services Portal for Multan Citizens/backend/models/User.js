import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      // Not required by default because Google OAuth users won't have a local password initially
      required: function () {
        return !this.googleId;
      },
      minlength: [8, "Password must be at least 8 characters long"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user", // Standard sign-ups default to a normal registered user
    },
    // Stores the relative server file path or external web address string cleanly
    profilePic: {
      type: String,
      default: null, // Initialized as empty so frontend text initial fallbacks kick in
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    /* ADDITIONAL FIELDS FOR GOOGLE OAUTH */
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple 'null' values for users who sign up via standard email/password
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  },
);

// PRE-SAVE HOOK: Hashes the password automatically
userSchema.pre('save', async function () {
    // Stop if the password wasn't changed, OR if there is no password to hash (Google users)
    if (!this.isModified('password') || !this.password) return;

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        throw new Error(error);
    }
});

// To compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Validates current password and updates to a new hashed password
userSchema.methods.updateUserPassword = async function (currentPassword, newPassword) {
    // Verify the current password matches
    const isMatch = await bcrypt.compare(currentPassword, this.password);
    if (!isMatch) {
        throw new Error("Current password matches incorrectly.");
    }

    // Assign the new plain text password
    this.password = newPassword;

    // Save the document (this fires the pre-save hook automatically)
    return await this.save();
};

const User = mongoose.model("Users", userSchema);

export default User;