const express = require("express");
const router = express.Router();

const {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
} = require("../controllers/ideas.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, createIdea);
router.get("/", getAllIdeas);
router.get("/:id", getIdeaById);
router.put("/:id", authMiddleware, updateIdea);
router.delete("/:id", authMiddleware, deleteIdea);

module.exports = router;