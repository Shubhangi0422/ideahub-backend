const prisma = require("../config/prisma");

// Create Idea
const createIdea = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      references,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const idea = await prisma.idea.create({
      data: {
        title,
        description,
        category,
        tags: tags || [],
        references,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Idea created successfully",
      idea,
    });
  } catch (error) {
    console.error("CREATE IDEA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Ideas
const getAllIdeas = async (req, res) => {
  try {
    const { search, category, tag } = req.query;

    const where = {};

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        has: tag,
      };
    }

    const ideas = await prisma.idea.findMany({
      where,
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
      count: ideas.length,
      ideas,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Idea
const getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.findUnique({
      where: { id },
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

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    res.status(200).json({
      success: true,
      idea,
    });
  } catch (error) {
    console.error("GET IDEA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.findUnique({
      where: { id },
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    if (idea.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own ideas",
      });
    }

    const updatedIdea = await prisma.idea.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Idea updated successfully",
      idea: updatedIdea,
    });
  } catch (error) {
    console.error("UPDATE IDEA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    const idea = await prisma.idea.findUnique({
      where: { id },
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    // Only creator can delete
    if (idea.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own ideas",
      });
    }

    await prisma.idea.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "Idea deleted successfully",
    });
  } catch (error) {
    console.error("DELETE IDEA ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createIdea,
  getAllIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea,
};