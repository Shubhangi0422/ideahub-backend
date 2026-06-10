const express = require("express");
const router = express.Router();

const {
  saveIdea,
  removeSavedIdea,
  getMySavedIdeas,
} = require("../controllers/saved.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/:ideaId", authMiddleware, saveIdea);
router.delete("/:ideaId", authMiddleware, removeSavedIdea);
router.get("/", authMiddleware, getMySavedIdeas);

module.exports = router;