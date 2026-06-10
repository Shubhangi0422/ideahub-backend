const prisma = require("../config/prisma");
const bcrypt = require("bcryptjs");

// Get My Ideas
const getMyIdeas = async (req, res) => {
  try {
    const ideas = await prisma.idea.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        comments: true,
        likes: true,
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
    console.error("GET MY IDEAS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Comments
const getMyComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        idea: {
          select: {
            id: true,
            title: true,
            category: true,
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
    console.error("GET MY COMMENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Likes
const getMyLikes = async (req, res) => {
  try {
    const likes = await prisma.like.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        idea: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: likes.length,
      likes,
    });
  } catch (error) {
    console.error("GET MY LIKES ERROR:", error);

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
            comments: true,
            likes: true,
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
    console.error("GET MY SAVED IDEAS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // Update User (only Name is allowed to be updated)
    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect current password",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyIdeas,
  getMyComments,
  getMyLikes,
  getMySavedIdeas,
  updateProfile,
  changePassword,
};