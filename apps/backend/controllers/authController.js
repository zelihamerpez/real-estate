// apps/backend/controllers/authController.js
const admin = require("../firebase/admin");

// POST /api/auth/signup
exports.createUser = async (req, res) => {
  const { email, password, displayName } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || "",
    });

    res.status(201).json({
      message: "User created successfully",
      uid: userRecord.uid,
      email: userRecord.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
