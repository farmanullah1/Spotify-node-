const express = require("express");
const musicController = require("../controllers/music.controller.js");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware.js");
const { uploadAudio } = require("../middlewares/upload.middleware.js");

const router = express.Router();

// Retrieve all music tracks (authenticated users and artists)
router.get("/", authenticate, musicController.getMusicList);

// Retrieve music uploaded by currently logged-in artist
router.get("/my-music", authenticate, authorizeRoles("artist"), musicController.getMyMusic);

// Retrieve a single track by ID
router.get("/:id", authenticate, musicController.getMusicById);

// Upload music track (artists only, audio MIME validation, max 50MB)
router.post("/", authenticate, authorizeRoles("artist"), uploadAudio, musicController.createMusic);
router.post("/upload", authenticate, authorizeRoles("artist"), uploadAudio, musicController.createMusic);

module.exports = router;