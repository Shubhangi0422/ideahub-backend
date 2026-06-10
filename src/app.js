const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const ideaRoutes = require("./routes/ideas.routes");
const commentRoutes = require("./routes/comments.routes");
const likeRoutes = require("./routes/likes.routes");
const savedRoutes = require("./routes/saved.routes");
const userRoutes = require("./routes/users.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ideas", ideaRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/users", userRoutes);
module.exports = app;