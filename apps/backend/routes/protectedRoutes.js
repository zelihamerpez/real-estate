const express = require("express");
const router = express.Router();
const admin = require("../firebase/admin");

// Middleware to check Firebase token
const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Simple protected route
router.get("/", checkAuth, (req, res) => {
  res.json({message : "🎉 WOW you logged in XD 🎉"});
});

module.exports = router;
