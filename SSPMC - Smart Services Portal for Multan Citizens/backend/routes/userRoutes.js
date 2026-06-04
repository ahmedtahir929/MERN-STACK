import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import "../config/passport.js"; // Ensure passport config runs

// Note the explicit .js extension on relative paths
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
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
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');

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
    failureRedirect: `${FRONTEND_URL}/login`,
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
    res.redirect(`${FRONTEND_URL}/oauth-success?token=${token}`);
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
  upload.single("profilePic"),
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
