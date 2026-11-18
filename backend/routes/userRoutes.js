
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile
} = require("../controllers/userController");

// All routes require authentication
router.use(authMiddleware);

// User's own profile
router.get("/me", getMyProfile);
router.patch("/me/profile", updateMyProfile);

// Admin-only routes
router.use(adminMiddleware);

router.post("/", createUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
