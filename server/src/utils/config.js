require("dotenv").config();

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;
const MONGODB_URI = process.env.MONGODB_URI;
const SESSIONSDB_URI = process.env.SESSIONSDB_URI;
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
    GOOGLE_CALLBACK_URL,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    FRONTEND_URL,
    MONGODB_URI,
    SESSIONSDB_URI,
    PORT,
    NODE_ENV,
};
