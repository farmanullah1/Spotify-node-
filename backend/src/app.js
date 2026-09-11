const express = require("express");
const cors = require("cors");
const cookie_parser = require("cookie-parser");
const authRoutes = require("./routes/auth.routes.js");
const musicRoutes = require("./routes/music.routes.js");
const albumRoutes = require("./routes/album.routes.js");
const app = express();

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());

app.get("/", (req, res) => {
    res.send("Spotify Backend is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/musics", musicRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/albums", albumRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err);
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: err.message || "An unexpected error occurred."
    });
});

module.exports = app;