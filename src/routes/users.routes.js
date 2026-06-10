const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getMyIdeas,
  getMyComments,
  getMyLikes,
  getMySavedIdeas,
  updateProfile,
  changePassword,
} = require("../controllers/users.controller");

router.get("/my-ideas", authMiddleware, getMyIdeas);
router.get("/my-comments", authMiddleware, getMyComments);
router.get("/my-likes", authMiddleware, getMyLikes);
router.get("/my-saved-ideas", authMiddleware, getMySavedIdeas);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;