const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));


// API routes
app.use("/login", authRoutes);
app.use("/users", userRoutes);

// Fallback for frontend
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "public", "users.html"));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
