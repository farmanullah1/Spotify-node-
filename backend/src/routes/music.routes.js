const express = require("express");
const musicController = require("../controllers/music.controller.js");
const {
    authenticate,
    optionalAuthenticate,
    authenticateArtist,
} = require("../middlewares/auth.middleware.js");
const { uploadAudio } = require("../middlewares/upload.middleware.js");

const router = express.Router();

// Retrieve all music tracks (accessible by guests, users, and artists)
router.get("/", optionalAuthenticate, musicController.getAllMusic);

// Retrieve music uploaded by currently logged-in artist (artists only)
router.get("/my-music", authenticateArtist, musicController.getMyMusic);

// Retrieve a single track by ID
router.get("/:id", optionalAuthenticate, musicController.getMusicById);

// Upload music track (accessible ONLY by artist, audio validation, max 50MB)
router.post("/", authenticateArtist, uploadAudio, musicController.createMusic);
router.post("/upload", authenticateArtist, uploadAudio, musicController.createMusic);

module.exports = router;