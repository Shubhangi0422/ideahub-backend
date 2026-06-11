const prisma = require("../config/prisma");

// Create Comment
const createComment = async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Comment content is required",
      });
    }

    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: req.user.id,
        ideaId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (req.user.id !== idea.userId) {
      await prisma.notification.create({
        data: {
          type: "COMMENT",
          userId: idea.userId,
          actorId: req.user.id,
          ideaId,
          commentId: comment.id,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("CREATE COMMENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Comments of an Idea
const getCommentsByIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const comments = await prisma.comment.findMany({
      where: {
        ideaId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("GET COMMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getCommentsByIdea,
};