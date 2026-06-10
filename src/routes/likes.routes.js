const express = require("express");
const router = express.Router();

const {
  likeIdea,
  unlikeIdea,
  getLikesCount,
} = require("../controllers/likes.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/:ideaId", authMiddleware, likeIdea);
router.delete("/:ideaId", authMiddleware, unlikeIdea);
router.get("/:ideaId", getLikesCount);

module.exports = router;