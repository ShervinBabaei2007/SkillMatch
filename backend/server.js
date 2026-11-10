require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const profileRoute = require("./routes/profile");
const registerCourseRoute = require("./routes/register");
const workshopRoutes = require("./routes/workshopRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

console.log("Auth:", typeof authRoutes);
console.log("Profile:", typeof profileRoute);
console.log("Register:", typeof registerCourseRoute);
console.log("Workshops:", typeof workshopRoutes);

// Serverless-safe: connect lazily and reuse the connection across requests
let connectionPromise;
function connectDB() {
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .then(() => console.log("✅ Connected to MongoDB Atlas"))
      .catch((err) => {
        connectionPromise = undefined;
        throw err;
      });
  }
  return connectionPromise;
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoute);
app.use("/api/course", registerCourseRoute);
app.use("/api/workshops", workshopRoutes);
app.get("/", (req, res) => res.send("Hello World!"));

// Local dev: run directly. On Vercel, the exported app is used instead.
if (require.main === module) {
  app.listen(PORT, () => console.log(`🚀 App listening at http://localhost:${PORT}`));
}

module.exports = app;
