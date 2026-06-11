const express = require("express");
const router = express.Router();

const {
  getNotifications,
  markAllAsRead,
  markAsRead,
} = require("../controllers/notifications.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getNotifications);
router.put("/read", authMiddleware, markAllAsRead);
router.put("/:id/read", authMiddleware, markAsRead);

module.exports = router;
