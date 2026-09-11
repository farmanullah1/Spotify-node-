const { queryDatabase } = require("../config/db.js");

/**
 * Ensures the users table exists in MSSQL with standard T-SQL check.
 */
async function ensureUserTableExists() {
    const query = `
    IF OBJECT_ID(N'dbo.SpotifyUsers', N'U') IS NULL
    BEGIN
        CREATE TABLE dbo.SpotifyUsers (
            id INT PRIMARY KEY IDENTITY(1,1),
            username NVARCHAR(255) NOT NULL UNIQUE,
            email NVARCHAR(255) NOT NULL UNIQUE,
            password NVARCHAR(255) NOT NULL,
            role NVARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'artist')),
            created_at DATETIME2 DEFAULT GETDATE()
        );
    END
  `;
    await queryDatabase(query);
    console.log("[Database] 'SpotifyUsers' table check/creation verified.");
}

/**
 * Creates a new user record.
 */
async function createUser({ username, email, password, role = 'user' }) {
    const query = `
    INSERT INTO dbo.SpotifyUsers (username, email, password, role)
    OUTPUT INSERTED.id, INSERTED.username, INSERTED.email, INSERTED.role, INSERTED.created_at
    VALUES (@username, @email, @password, @role);
  `;
    const result = await queryDatabase(query, { username, email, password, role });
    return result.recordset[0];
}

/**
 * Finds user by email address.
 */
async function findUserByEmail(email) {
    const query = `
    SELECT TOP 1 id, username, email, password, role, created_at
    FROM dbo.SpotifyUsers
    WHERE email = @email;
  `;
    const result = await queryDatabase(query, { email });
    return result.recordset[0] || null;
}

/**
 * Finds user by username.
 */
async function findUserByUsername(username) {
    const query = `
    SELECT TOP 1 id, username, email, password, role, created_at
    FROM dbo.SpotifyUsers
    WHERE username = @username;
  `;
    const result = await queryDatabase(query, { username });
    return result.recordset[0] || null;
}

/**
 * Finds user by either email or username.
 */
async function findUserByEmailOrUsername(identifier) {
    const query = `
    SELECT TOP 1 id, username, email, password, role, created_at
    FROM dbo.SpotifyUsers
    WHERE LOWER(email) = LOWER(@identifier) OR LOWER(username) = LOWER(@identifier);
  `;
    const result = await queryDatabase(query, { identifier });
    return result.recordset[0] || null;
}

/**
 * Finds user by ID (excluding password).
 */
async function findUserById(id) {
    const query = `
    SELECT TOP 1 id, username, email, role, created_at
    FROM dbo.SpotifyUsers
    WHERE id = @id;
  `;
    const result = await queryDatabase(query, { id });
    return result.recordset[0] || null;
}

module.exports = {
    ensureUserTableExists,
    createUser,
    findUserByEmail,
    findUserByUsername,
    findUserByEmailOrUsername,
    findUserById
};