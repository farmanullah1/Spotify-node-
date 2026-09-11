const express = require("express");
const albumController = require("../controllers/album.controller.js");
const { authenticate, authorizeRoles } = require("../middlewares/auth.middleware.js");
const { uploadAny } = require("../middlewares/upload.middleware.js");

const router = express.Router();

// Retrieve all albums (accessible by both 'user' and 'artist')
router.get("/", authenticate, albumController.getAllAlbum);

// Retrieve all albums of the logged-in artist
router.get("/my-albums", authenticate, authorizeRoles("artist"), albumController.getMyAlbums);

// Retrieve a single album by ID
router.get("/:id", authenticate, albumController.getAlbumById);

// Create an album (accessible ONLY by 'artist')
router.post("/", authenticate, authorizeRoles("artist"), uploadAny, albumController.createAlbum);
router.post("/upload", authenticate, authorizeRoles("artist"), uploadAny, albumController.createAlbum);

module.exports = router;
