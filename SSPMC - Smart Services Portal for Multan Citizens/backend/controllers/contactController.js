import Contact from "../models/Contact.js";

export const createContactSubmission = async (req, res) => {
  try {
    const { name, email, type, message } = req.body;

    // Check basic validations
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "All form fields are mandatory." });
    }

    const newSubmission = new Contact({
      name,
      email,
      type,
      message,
      // If client is unsigned, req.user.role is 'unsigned', meaning ID is omitted (null)
      userId: req.user && req.user.role !== "unsigned" ? req.user.id : null
    });

    await newSubmission.save();
    res.status(201).json({ message: "Feedback submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Submission failure.", error: error.message });
  }
};