const ImageKit = require("@imagekit/nodejs");

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(fileBuffer, fileName) {
    const result = await imagekit.files.upload({
        file: fileBuffer.toString("base64"),
        fileName: fileName,
        folder: "spotify/musics",
    });
    return result;
}

module.exports = {
    uploadFile,
};
