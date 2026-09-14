const albumModel = require("../models/album.models.js");
const musicModel = require("../models/music.models.js");

/**
 * Formats an album database record into a clean JSON structure with nested music and artist objects.
 */
function formatAlbum(album) {
    if (!album) return null;
    return {
        id: album.id,
        title: album.title,
        musicId: album.musicId,
        music: album.musicId ? {
            id: album.musicId,
            title: album.musicTitle,
            uri: album.musicUri,
        } : null,
        artistId: album.artistId,
        artist: {
            id: album.artistId,
            username: album.artistName,
        },
        artistName: album.artistName,
        musicTitle: album.musicTitle,
        musicUri: album.musicUri,
        created_at: album.created_at,
    };
}

/**
 * Creates a new album associated with an audio track and the authenticated artist.
 * Accessible ONLY by artists.
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
            album: {
                ...album,
                artist: {
                    id: req.user.id,
                    username: req.user.username,
                },
                music: {
                    id: track.id,
                    title: track.title,
                    uri: track.uri,
                }
            },
        });
    } catch (error) {
        next(error);
    }
}

/**
 * Retrieves all albums across the platform.
 * Accessible by both users and artists.
 */
async function getAllAlbum(req, res, next) {
    try {
        const rawAlbums = await albumModel.getAllAlbum();
        const albums = rawAlbums.map(formatAlbum);

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
 * Accessible by both users and artists.
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

        const rawAlbum = await albumModel.getAlbumById(id);
        if (!rawAlbum) {
            return res.status(404).json({
                error: "Not Found",
                message: `Album with ID ${id} was not found.`,
            });
        }

        const album = formatAlbum(rawAlbum);

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
        const rawAlbums = await albumModel.getAlbumsByArtist(req.user.id);
        const albums = rawAlbums.map(formatAlbum);

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
    getAlbum: getAllAlbum, // alias
    getAlbums: getAllAlbum, // alias
    getAlbumById,
    getMyAlbums,
};
