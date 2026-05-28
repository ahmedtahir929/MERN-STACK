import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters."]
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please provide a valid email address."
      ]
    },
    type: {
      type: String,
      required: [true, "Inquiry type is required."],
      enum: ["general", "suggestion", "complaint"],
      default: "general"
    },
    message: {
      type: String,
      required: [true, "Message body is required."],
      trim: true,
      maxlength: [2000, "Message cannot exceed 2000 characters."]
    },
    // Optional Foreign Key referencing your compiled Users model
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Must match the exact collection model identifier string
      default: null
    },
    isResolved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexing frequently queried fields for administrative dashboards
contactSchema.index({ email: 1 });
contactSchema.index({ type: 1 });
contactSchema.index({ isResolved: 1 });

const Contact = mongoose.model("Contacts", contactSchema);
export default Contact;