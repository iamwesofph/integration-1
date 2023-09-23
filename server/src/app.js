const config = require("./utils/config");
const express = require("express");
const app = express();

//TODO try removing these 2 later
const bodyParser = require("body-parser");
// const flash = require("express-flash");

const cors = require("cors");
const anecdotesRouter = require("./controllers/anecdotes");
const authRouter = require("./controllers/auth");
const middleware = require("./utils/middleware");
const winstonLogger = require("./utils/winstonLogger");

const mongoose = require("mongoose");

//Add session support
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

mongoose.set("strictQuery", false);

winstonLogger.info(`connecting to ${config.MONGODB_URI}`);

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        winstonLogger.info("Connected to MongoDB");
    } catch (error) {
        winstonLogger.error("Error connecting to MongoDB:", error.message);
    }
};
connectToMongoDB();

// app.use(
//     cors({
//         origin: config.FRONTEND_URL,
//         methods: "GET,POST,PUT,DELETE",
//         credentials: true,
//     })
// );

// Allow requests from your frontend origin
const allowedOrigins = ["https://integration-react.onrender.com"];
app.use(
    cors({
        origin: (origin, callback) => {
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
    })
);

// app.use(middleware.requestLogger);
app.use((req, res, next) => {
    winstonLogger.info(`Received ${req.method} request for ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
    session({
        secret: "secr3t",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: config.SESSIONSDB_URI }),
    })
);

//Authenticate the session
// app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRouter);
app.use("/", anecdotesRouter);

app.use(middleware.errorHandler);

module.exports = app;
