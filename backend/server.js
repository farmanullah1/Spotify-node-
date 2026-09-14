require("dotenv").config();
const app = require("./src/app.js");
const { connectToDatabase } = require("./src/config/db.js");

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server due to database error:", err);
        process.exit(1);
    }
}

startServer();
