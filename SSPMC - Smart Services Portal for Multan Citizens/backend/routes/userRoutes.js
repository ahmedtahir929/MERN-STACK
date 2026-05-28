import express from "express";
import passport from "passport";
import multer from 'multer';
import path from 'path';
import jwt from "jsonwebtoken";
import "../config/passport.js"; // Ensure passport config runs

// Note the explicit .js extension on relative paths
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  loginUser,
  updatePassword,
  updateUserDetails,
  updateAvatar
} from "../controllers/userController.js";

const userRouter = express.Router();

// Configure the disk pipeline directory allocation parameters for structural storage mapping
const avatarStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/'); // Ensure this nested directory structure exists inside your backend folder path root
  },
  filename: (req, file, cb) => {
    // Generate a unique timestamp slug identifier signature to eliminate duplicate file collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Enforce image asset format validations filter rules
const fileTypeFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid asset specification. Only image mime streams are permitted.'), false);
  }
};

const uploadAvatarParser = multer({ 
  storage: avatarStorageEngine,
  fileFilter: fileTypeFilter,
  limits: { fileSize: 3 * 1024 * 1024 } // Optional limit rule barrier capped at 3 megabytes
});

// post endpoints
userRouter.post("/signup", createUser);
userRouter.post("/login", authenticate, loginUser);

// get endpoints
// Route to kick off the Google login process
userRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Google callback route where the user lands after logging into Google
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `http://localhost:5173/login`,
    session: false,
  }),
  (req, res) => {
    // Passport attaches the authenticated user instance to req.user
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    // Redirect the user back to the frontend dashboard, appending the JWT token to the URL string
    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  },
);
userRouter.get("/user-list", authenticate, authorize("admin"), getUsers);
userRouter.get("/profile/:id", authenticate, getUserById);

// put endpoints
userRouter.put(
  "/update/user-details/:id",
  authenticate,
  authorize("user", "admin"),
  updateUserDetails,
);
userRouter.put(
  "/profile/update/:id",
  authenticate,
  authorize("user", "admin"),
  updateUserDetails,
);
userRouter.put(
  "/profile/update/password/:id",
  authenticate,
  authorize("user", "admin"),
  updatePassword,
);
userRouter.put(
  "/profile/avatar/:id",
  authenticate,
  uploadAvatarParser.single("profilePic"),
  updateAvatar,
);

// delete endpoints
userRouter.delete(
  "/profile/delete/:id",
  authenticate,
  authorize("user", "admin"),
  deleteUser,
);

export default userRouter;
