const { queryDatabase } = require("../config/db.js");

/**
 * Ensures the SpotifyAlbum table exists.
 */
async function ensureAlbumTableExists() {
    const query = `
    IF OBJECT_ID(N'dbo.SpotifyAlbum', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.SpotifyAlbum (
            id INT PRIMARY KEY IDENTITY(1,1),
            title NVARCHAR(255) NOT NULL,
            musicId INT NOT NULL FOREIGN KEY REFERENCES dbo.SpotifyMusic(id),
            artistId INT NOT NULL FOREIGN KEY REFERENCES dbo.SpotifyUsers(id),
            created_at DATETIME2 DEFAULT GETDATE()
        );
    END
  `;
    await queryDatabase(query);
    console.log("[Database] 'SpotifyAlbum' table check verified.");
}

/**
 * Creates a new album entry.
 */
async function createAlbum({ title, musicId, artistId }) {
    const query = `
    INSERT INTO dbo.SpotifyAlbum (title, musicId, artistId)
    OUTPUT INSERTED.id, INSERTED.title, INSERTED.musicId, INSERTED.artistId, INSERTED.created_at
    VALUES (@title, @musicId, @artistId);
  `;
    const result = await queryDatabase(query, { title, musicId, artistId });
    return result.recordset[0];
}

/**
 * Retrieves all albums with joined artist and track details.
 */
async function getAllAlbum() {
    const query = `
    SELECT 
        a.id, 
        a.title, 
        a.musicId, 
        m.title AS musicTitle, 
        m.uri AS musicUri, 
        a.artistId, 
        u.username AS artistName,
        a.created_at
    FROM dbo.SpotifyAlbum a
    JOIN dbo.SpotifyUsers u ON a.artistId = u.id
    LEFT JOIN dbo.SpotifyMusic m ON a.musicId = m.id
    ORDER BY a.created_at DESC;
  `;
    const result = await queryDatabase(query);
    return result.recordset || [];
}

/**
 * Retrieves a single album by its ID with joined artist and track details.
 */
async function getAlbumById(id) {
    const query = `
    SELECT TOP 1
        a.id, 
        a.title, 
        a.musicId, 
        m.title AS musicTitle, 
        m.uri AS musicUri, 
        a.artistId, 
        u.username AS artistName,
        a.created_at
    FROM dbo.SpotifyAlbum a
    JOIN dbo.SpotifyUsers u ON a.artistId = u.id
    LEFT JOIN dbo.SpotifyMusic m ON a.musicId = m.id
    WHERE a.id = @id;
  `;
    const result = await queryDatabase(query, { id });
    return result.recordset[0] || null;
}

/**
 * Retrieves all albums created by a specific artist.
 */
async function getAlbumsByArtist(artistId) {
    const query = `
    SELECT 
        a.id, 
        a.title, 
        a.musicId, 
        m.title AS musicTitle, 
        m.uri AS musicUri, 
        a.artistId, 
        u.username AS artistName,
        a.created_at
    FROM dbo.SpotifyAlbum a
    JOIN dbo.SpotifyUsers u ON a.artistId = u.id
    LEFT JOIN dbo.SpotifyMusic m ON a.musicId = m.id
    WHERE a.artistId = @artistId
    ORDER BY a.created_at DESC;
  `;
    const result = await queryDatabase(query, { artistId });
    return result.recordset || [];
}

module.exports = {
    ensureAlbumTableExists,
    createAlbum,
    getAllAlbum,
    getAlbumById,
    getAlbumsByArtist,
};
