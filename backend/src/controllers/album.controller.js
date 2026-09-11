const albumModel = require("../models/album.models.js");
const musicModel = require("../models/music.models.js");

/**
 * Creates a new album associated with an audio track and the authenticated artist.
 */
async function createAlbum(req, res, next) {
    try {
        const title = (req.body && req.body.title ? String(req.body.title) : "").trim();
        const rawMusicId = req.body && req.body.musicId;

        if (!title) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Album title is required.",
            });
        }

        if (title.length > 255) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Album title cannot exceed 255 characters.",
            });
        }

        const musicId = parseInt(rawMusicId, 10);
        if (isNaN(musicId) || musicId <= 0) {
            return res.status(400).json({
                error: "Bad Request",
                message: "A valid positive integer musicId is required.",
            });
        }

        // Verify that the referenced music track exists
        const track = await musicModel.getMusicById(musicId);
        if (!track) {
            return res.status(404).json({
                error: "Not Found",
                message: `Music track with ID ${musicId} was not found.`,
            });
        }

        // Save album linked to authenticated artist
        const album = await albumModel.createAlbum({
            title,
            musicId,
            artistId: req.user.id,
        });

        return res.status(201).json({
            message: "Album created successfully.",
            album,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves all albums across the platform.
 */
async function getAllAlbum(req, res, next) {
    try {
        const albums = await albumModel.getAllAlbum();
        return res.status(200).json({
            message: "Albums fetched successfully.",
            albums,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves a single album by its ID.
 */
async function getAlbumById(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Invalid album ID provided.",
            });
        }

        const album = await albumModel.getAlbumById(id);
        if (!album) {
            return res.status(404).json({
                error: "Not Found",
                message: "Album not found.",
            });
        }

        return res.status(200).json({
            message: "Album fetched successfully.",
            album,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves all albums created by the currently authenticated artist.
 */
async function getMyAlbums(req, res, next) {
    try {
        const albums = await albumModel.getAlbumsByArtist(req.user.id);
        return res.status(200).json({
            message: "Artist albums fetched successfully.",
            albums,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createAlbum,
    getAllAlbum,
    getAlbumById,
    getMyAlbums,
};
