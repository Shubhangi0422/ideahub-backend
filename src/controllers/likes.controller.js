const prisma = require("../config/prisma");

// Like Idea
const likeIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: req.user.id,
        ideaId,
      },
    });

    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: "Idea already liked",
      });
    }

    await prisma.like.create({
      data: {
        userId: req.user.id,
        ideaId,
      },
    });

    if (req.user.id !== idea.userId) {
      await prisma.notification.create({
        data: {
          type: "LIKE",
          userId: idea.userId,
          actorId: req.user.id,
          ideaId,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Idea liked successfully",
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Unlike Idea
const unlikeIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: req.user.id,
        ideaId,
      },
    });

    if (!existingLike) {
      return res.status(404).json({
        success: false,
        message: "Like not found",
      });
    }

    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });

    // Delete corresponding notification
    await prisma.notification.deleteMany({
      where: {
        type: "LIKE",
        actorId: req.user.id,
        ideaId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Like removed successfully",
    });
  } catch (error) {
    console.error("UNLIKE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Likes Count
const getLikesCount = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const count = await prisma.like.count({
      where: {
        ideaId,
      },
    });

    res.status(200).json({
      success: true,
      likesCount: count,
    });
  } catch (error) {
    console.error("COUNT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  likeIdea,
  unlikeIdea,
  getLikesCount,
};