import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required."],
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters."],
    },
    category: {
      type: String,
      required: [true, "Category is required."],
      enum: ["hospital", "restaurant", "park"],
      lowercase: true,
    },
    imageUrl: {
      type: String,
      // Required only if an uploaded image string is missing
      required: function () {
        return !this.imageUpload;
      },
      trim: true,
    },
    imageUpload: {
      type: String,
      // Required only if a direct image URL is missing
      required: function () {
        return !this.imageUrl;
      },
    },
    location: {
      address: {
        type: String,
        required: [true, "Physical address is required."],
        trim: true,
      },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be below 0."],
      max: [5, "Rating cannot exceed 5."],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "Owner ID is required to track service submissions."],
    },
    updatedBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Indexes to speed up category filtering and geographical sorting
serviceSchema.index({ category: 1 });
serviceSchema.index({ name: 1 });

const Service = mongoose.model("Services", serviceSchema);
export default Service;
