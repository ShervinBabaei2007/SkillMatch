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

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoute);
app.use("/api/course", registerCourseRoute);
app.use("/api/workshops", workshopRoutes);
app.get("/", (req, res) => res.send("Hello World!"));

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB Atlas");

    setInterval(
      async () => {
        try {
          await mongoose.connection.db.admin().ping();
          console.log("DB keepalive ping");
        } catch (err) {
          console.error("Keepalive ping failed:", err);
        }
      },
      5 * 60 * 1000,
    );

    app.listen(PORT, () => console.log(`🚀 App listening at http://localhost:${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

startServer();