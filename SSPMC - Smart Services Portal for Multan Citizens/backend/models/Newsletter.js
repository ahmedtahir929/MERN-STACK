import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email address is required to subscribe."],
      unique: true, // Prevents duplicate email rows in the cluster
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address.",
      ],
    },
    isActive: {
      type: Boolean,
      default: true, // Useful if you need to support an unsubscribe loop feature later
    },
  },
  {
    timestamps: true, // Automatically logs exactly when they subscribed
  }
);

const Newsletter = mongoose.model("Newsletter", newsletterSchema);
export default Newsletter;