const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByIdea,
} = require("../controllers/comments.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/:ideaId", authMiddleware, createComment);
router.get("/:ideaId", getCommentsByIdea);

module.exports = router;