const { queryDatabase } = require("../config/db.js");

/**
 * Ensures the SpotifyMusic table exists.
 */
async function ensureMusicTableExists() {
    const query = `
    IF OBJECT_ID(N'dbo.SpotifyMusic', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.SpotifyMusic (
            id INT PRIMARY KEY IDENTITY(1,1),
            uri NVARCHAR(500) NOT NULL UNIQUE,
            title NVARCHAR(255) NOT NULL,
            artistId INT NOT NULL FOREIGN KEY REFERENCES dbo.SpotifyUsers(id),
            created_at DATETIME2 DEFAULT GETDATE()
        );
    END
  `;
    await queryDatabase(query);
    console.log("[Database] 'SpotifyMusic' table check verified.");
}

/**
 * Creates a new music track.
 */
async function createMusic({ uri, title, artistId }) {
    const query = `
    INSERT INTO dbo.SpotifyMusic (uri, title, artistId)
    OUTPUT INSERTED.id, INSERTED.uri, INSERTED.title, INSERTED.artistId, INSERTED.created_at
    VALUES (@uri, @title, @artistId);
  `;
    const result = await queryDatabase(query, { uri, title, artistId });
    return result.recordset[0];
}

/**
 * Retrieves all tracks ordered by newest first with artist name.
 */
async function getAllMusic() {
    const query = `
    SELECT 
        m.id, 
        m.uri, 
        m.title, 
        m.artistId, 
        u.username AS artistName,
        m.created_at
    FROM dbo.SpotifyMusic m
    JOIN dbo.SpotifyUsers u ON m.artistId = u.id
    ORDER BY m.created_at DESC;
  `;
    const result = await queryDatabase(query);
    return result.recordset || [];
}

/**
 * Finds a single track by its ID with artist details.
 */
async function getMusicById(id) {
    const query = `
    SELECT TOP 1
        m.id, 
        m.uri, 
        m.title, 
        m.artistId, 
        u.username AS artistName,
        m.created_at
    FROM dbo.SpotifyMusic m
    JOIN dbo.SpotifyUsers u ON m.artistId = u.id
    WHERE m.id = @id;
  `;
    const result = await queryDatabase(query, { id });
    return result.recordset[0] || null;
}

/**
 * Retrieves all tracks uploaded by a specific artist.
 */
async function getMusicByArtist(artistId) {
    const query = `
    SELECT 
        m.id, 
        m.uri, 
        m.title, 
        m.artistId, 
        u.username AS artistName,
        m.created_at
    FROM dbo.SpotifyMusic m
    JOIN dbo.SpotifyUsers u ON m.artistId = u.id
    WHERE m.artistId = @artistId
    ORDER BY m.created_at DESC;
  `;
    const result = await queryDatabase(query, { artistId });
    return result.recordset || [];
}

module.exports = {
    ensureMusicTableExists,
    ensureUserTableExists: ensureMusicTableExists, // backward-compatibility alias
    createMusic,
    getAllMusic,
    getMusicById,
    getMusicByArtist,
};


