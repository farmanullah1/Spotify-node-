const express = require("express");
const albumController = require("../controllers/album.controller.js");
const {
    authenticate,
    optionalAuthenticate,
    authenticateArtist,
} = require("../middlewares/auth.middleware.js");
const { uploadAny } = require("../middlewares/upload.middleware.js");

const router = express.Router();

// Retrieve all albums (accessible by guests, users, and artists)
router.get("/", optionalAuthenticate, albumController.getAllAlbum);

// Retrieve all albums of the logged-in artist (artists only)
router.get("/my-albums", authenticateArtist, albumController.getMyAlbums);

// Retrieve a single album by ID
router.get("/:id", optionalAuthenticate, albumController.getAlbumById);

// Create an album (accessible ONLY by artist)
router.post("/", authenticateArtist, uploadAny, albumController.createAlbum);
router.post("/upload", authenticateArtist, uploadAny, albumController.createAlbum);

module.exports = router;
