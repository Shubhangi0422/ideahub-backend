const prisma = require("../config/prisma");

// Save Idea
const saveIdea = async (req, res) => {
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

    const existingSave = await prisma.savedIdea.findFirst({
      where: {
        userId: req.user.id,
        ideaId,
      },
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: "Idea already saved",
      });
    }

    await prisma.savedIdea.create({
      data: {
        userId: req.user.id,
        ideaId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Idea saved successfully",
    });
  } catch (error) {
    console.error("SAVE IDEA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Saved Idea
const removeSavedIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const savedIdea = await prisma.savedIdea.findFirst({
      where: {
        userId: req.user.id,
        ideaId,
      },
    });

    if (!savedIdea) {
      return res.status(404).json({
        success: false,
        message: "Saved idea not found",
      });
    }

    await prisma.savedIdea.delete({
      where: {
        id: savedIdea.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Saved idea removed successfully",
    });
  } catch (error) {
    console.error("REMOVE SAVED IDEA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Saved Ideas
const getMySavedIdeas = async (req, res) => {
  try {
    const savedIdeas = await prisma.savedIdea.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        idea: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: savedIdeas.length,
      savedIdeas,
    });
  } catch (error) {
    console.error("GET SAVED IDEAS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveIdea,
  removeSavedIdea,
  getMySavedIdeas,
};