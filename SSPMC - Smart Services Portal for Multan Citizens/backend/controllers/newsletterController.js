import Newsletter from "../models/Newsletter.js";

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: "Email input field cannot be left blank." });
    }

    // Check if the citizen has already subscribed previously
    const existingSubscriber = await Newsletter.findOne({ email: email.toLowerCase().trim() });
    if (existingSubscriber) {
      return res.status(400).json({ message: "This email is already subscribed to our newsletter updates!" });
    }

    // Save the brand new subscriber document
    await Newsletter.create({ email: email.toLowerCase().trim() });

    res.status(201).json({ 
      message: "Awesome! You've successfully subscribed to the SSPMC newsletter." 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to process newsletter subscription query.", 
      error: error.message 
    });
  }
};