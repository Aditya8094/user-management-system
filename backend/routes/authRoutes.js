
const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser
} = require("../controllers/authcontroller");

const authMiddleware = require("../middleware/authMiddleware");

// Registration API
router.post("/register", registerUser);

// Login API
router.post("/login", loginUser);

// Protected API - Get logged-in user details
router.get("/me", authMiddleware, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    user: req.user
  });
});

module.exports = router;
