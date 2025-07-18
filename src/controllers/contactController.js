import ContactMessage from "../models/ContactMessage.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, subject, and message are required." });
    }
    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
    });
    await contactMessage.save();
    res.status(201).json({ message: "Contact message sent successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to send contact message.",
        error: error.message,
      });
  }
};
