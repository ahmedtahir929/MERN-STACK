import express from "express";

import {
  createService,
  getServiceById,
  getAllServices,
  deleteService,
  updateService,
} from "../controllers/serviceController.js";

import { authenticate, authorize } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const serviceRouter = express.Router();

// Public: Anyone can view listings
serviceRouter.get("/", getAllServices);
serviceRouter.get("/:id", getServiceById);

// Registered Users & Admins: Can add listings (Multer field key is 'imageUpload')
serviceRouter.post(
  "/add-service",
  authenticate,
  authorize("user", "admin"),
  upload.single("imageUpload"),
  createService,
);

// PUT update endpoint for handling text forms or picture alterations
serviceRouter.put(
  "/update/service/:id",
  authenticate,
  authorize("user", "admin"),
  upload.single("imageUpload"),
  updateService,
);

// Only the User that added the service or Admin Only: Can delete listings
serviceRouter.delete(
  "/delete/service/:id",
  authenticate,
  authorize("user", "admin"),
  deleteService,
);

export default serviceRouter;
