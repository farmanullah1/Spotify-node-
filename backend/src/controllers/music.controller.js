const musicModel = require("../models/music.models.js");
const { uploadFile } = require("../services/storage.services.js");

/**
 * Uploads an audio track to ImageKit and records it in the database.
 * Only accessible by authenticated artists.
 */
async function createMusic(req, res, next) {
    try {
        const title = (req.body && req.body.title ? String(req.body.title) : "").trim();
        const file = req.file || (req.files && req.files[0]);

        if (!title) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Track title is required.",
            });
        }

        if (title.length > 255) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Track title cannot exceed 255 characters.",
            });
        }

        if (!file || !file.buffer) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Audio file is required.",
            });
        }

        // Upload file buffer to ImageKit
        let uploadResult;
        try {
            uploadResult = await uploadFile(file.buffer, file.originalname);
        } catch (uploadErr) {
            console.error("[MusicController] ImageKit upload failure:", uploadErr);
            return res.status(502).json({
                error: "Bad Gateway",
                message: "Failed to upload file to cloud storage.",
            });
        }

        if (!uploadResult || !uploadResult.url) {
            return res.status(502).json({
                error: "Bad Gateway",
                message: "Cloud storage did not return a valid file URL.",
            });
        }

        // Save track to MSSQL database
        const music = await musicModel.createMusic({
            uri: uploadResult.url,
            title,
            artistId: req.user.id,
        });

        return res.status(201).json({
            message: "Music uploaded successfully.",
            music,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves the full catalog of music tracks.
 */
async function getMusicList(req, res, next) {
    try {
        const musics = await musicModel.getAllMusic();
        return res.status(200).json({
            message: "Music fetched successfully.",
            musics,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves a single track by its ID.
 */
async function getMusicById(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Invalid music ID provided.",
            });
        }

        const music = await musicModel.getMusicById(id);
        if (!music) {
            return res.status(404).json({
                error: "Not Found",
                message: "Music track not found.",
            });
        }

        return res.status(200).json({
            message: "Music fetched successfully.",
            music,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves all tracks uploaded by the currently authenticated artist.
 */
async function getMyMusic(req, res, next) {
    try {
        const musics = await musicModel.getMusicByArtist(req.user.id);
        return res.status(200).json({
            message: "Artist music fetched successfully.",
            musics,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createMusic,
    getMusicList,
    getMusicById,
    getMyMusic,
};
