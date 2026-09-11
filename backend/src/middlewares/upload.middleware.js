const multer = require("multer");
const path = require("path");

// Allowed audio MIME types and file extensions
const ALLOWED_AUDIO_MIMES = new Set([
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/ogg",
    "audio/vorbis",
    "audio/aac",
    "audio/mp4",
    "audio/x-m4a",
    "audio/flac",
    "audio/x-flac",
]);

const ALLOWED_AUDIO_EXTENSIONS = new Set([
    ".mp3",
    ".wav",
    ".ogg",
    ".aac",
    ".m4a",
    ".flac",
]);

const audioFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = (file.mimetype || "").toLowerCase();

    if (ALLOWED_AUDIO_MIMES.has(mime) || ALLOWED_AUDIO_EXTENSIONS.has(ext)) {
        cb(null, true);
    } else {
        const error = new Error("Invalid file type. Only audio files (MP3, WAV, OGG, AAC, M4A, FLAC) are allowed.");
        error.code = "INVALID_FILE_TYPE";
        error.status = 400;
        cb(error, false);
    }
};

const storage = multer.memoryStorage();

const uploadAudio = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
    fileFilter: audioFilter,
});

const uploadAny = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
});

/**
 * Express middleware wrapper to catch Multer errors (e.g. file size exceeded, invalid type)
 * and respond with structured JSON rather than unhandled 500 errors.
 */
function handleUpload(multerMiddleware) {
    return (req, res, next) => {
        multerMiddleware(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        return res.status(413).json({
                            error: "Payload Too Large",
                            message: "File size exceeds the 50MB limit.",
                        });
                    }
                    return res.status(400).json({
                        error: "Bad Request",
                        message: `Upload error: ${err.message}`,
                    });
                }
                return res.status(err.status || 400).json({
                    error: "Bad Request",
                    message: err.message || "File upload failed.",
                });
            }
            next();
        });
    };
}

module.exports = {
    uploadAudio: handleUpload(uploadAudio.any()),
    uploadAny: handleUpload(uploadAny.any()),
};
