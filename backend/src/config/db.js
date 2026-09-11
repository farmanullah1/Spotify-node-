const sql = require("mssql/msnodesqlv8");

const config = {
    connectionString:
        `Driver={ODBC Driver 18 for SQL Server};` +
        `Server=${process.env.SERVER};` +
        `Database=${process.env.DATABASE};` +
        `Trusted_Connection=Yes;` +
        `TrustServerCertificate=Yes;`
};

let poolPromise = null;

async function connectToDatabase() {
    try {
        if (!poolPromise) {
            poolPromise = sql.connect(config);
        }
        await poolPromise;
        console.log("Connected to database successfully");

        await new sql.Request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SpotifyUsers')
            BEGIN
                CREATE TABLE SpotifyUsers (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    username NVARCHAR(255) NOT NULL UNIQUE,
                    email NVARCHAR(255) NOT NULL UNIQUE,
                    password NVARCHAR(255) NOT NULL,
                    role NVARCHAR(50) NOT NULL DEFAULT 'user',
                    created_at DATETIME2 DEFAULT GETDATE()
                );
            END

            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SpotifyMusic')
            BEGIN
                CREATE TABLE SpotifyMusic (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    uri NVARCHAR(500) NOT NULL UNIQUE,
                    title NVARCHAR(255) NOT NULL,
                    artistId INT NOT NULL FOREIGN KEY REFERENCES SpotifyUsers(id),
                    created_at DATETIME2 DEFAULT GETDATE()
                );
            END

            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'SpotifyAlbum')
            BEGIN
                CREATE TABLE SpotifyAlbum (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    title NVARCHAR(255) NOT NULL,
                    musicId INT NOT NULL FOREIGN KEY REFERENCES SpotifyMusic(id),
                    artistId INT NOT NULL FOREIGN KEY REFERENCES SpotifyUsers(id),
                    created_at DATETIME2 DEFAULT GETDATE()
                );
            END
        `);
        return poolPromise;
    } catch (error) {
        console.error("Database connection failed:", error);
        poolPromise = null;
        throw error;
    }
}

async function queryDatabase(queryText, params = {}) {
    await connectToDatabase();
    const request = new sql.Request();
    for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
    }
    return await request.query(queryText);
}

module.exports = {
    connectToDatabase,
    queryDatabase,
    sql
};