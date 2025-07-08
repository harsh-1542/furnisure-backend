import ClerkUser from "../models/ClerkUser.js";

// POST /api/users/sync
export const syncClerkUser = async (req, res) => {
  console.log("====================================");
  console.log("sync user is callled");
  console.log("====================================");
  try {
    const { clerkId, email, fullName, phoneNumber } = req.body;
    if (!clerkId || !email) {
      return res
        .status(400)
        .json({ message: "clerkId and email are required" });
    }

    // Find the existing user
    const existingUser = await ClerkUser.findOne({ clerkId });

    // If user exists and data is the same, skip update
    if (
      existingUser &&
      existingUser.email === email &&
      existingUser.fullName === fullName &&
      existingUser.phoneNumber === phoneNumber
    ) {
      return res
        .status(200)
        .json({ message: "User already synced", user: existingUser });
    }

    // Otherwise, update or insert
    const user = await ClerkUser.findOneAndUpdate(
      { clerkId },
      { email, fullName, phoneNumber },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: "User synced", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
