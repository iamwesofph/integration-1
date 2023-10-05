const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const requestLogger = (request, response, next) => {
    logger.info("Method:", request.method);
    logger.info("Path:  ", request.path);
    logger.info("Body:  ", request.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
    logger.error(error.message);

    if (error.name === "CastError") {
        return response.status(400).send({ error: "MIDDLEWARE CAST ERROR malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: `MIDDLEWARE VALIDATION ERROR ${error.message}` });
    } else if (error.name === "JsonWebTokenError") {
        return response.status(401).json({ error: `MIDDLEWARE JSONWEBTOKEN ERROR ${error.message}` });
    } else if (error.name === "TokenExpiredError") {
        return response.status(401).json({ error: `MIDDLEWARE TOKEN EXPIRED ERROR ${error.message}` });
    } else if (error.name === "ReferenceError") {
        return response.status(401).json({ error: `MIDDLEWARE TOKEN REFERENCE ERROR ${error.message}` });
    }
    next(error);
};

// moved the token extractor inside user extractor
// const tokenExtractor = (request, response, next) => {
//     const authorization = request.get("authorization");
//     console.log("MIDDLEWARE TOKENEXTRACTOR");
//     console.log(authorization);
//     if (authorization && authorization.startsWith("Bearer ")) {
//         request.token = authorization.replace("Bearer ", "");
//     }
//     next(); // Continue to the next middleware or route handler
// };

const userExtractor = async (request, response, next) => {
    const authorization = request.get("authorization");
    console.log("MIDDLEWARE TOKENEXTRACTOR");
    console.log(authorization);
    if (authorization && authorization.startsWith("Bearer ")) {
        request.token = authorization.replace("Bearer ", "");
    }

    console.log(`USEREXTRACTOR ${request.token}`);
    try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET);
        console.log(decodedToken);
        if (!decodedToken.id) {
            return response.status(401).json({ error: "token invalid" });
        }

        const user = await User.findById(decodedToken.id);
        console.log(user);

        request.user = user;
        next(); // Continue to the next middleware or route handler
    } catch (error) {
        // return response.status(401).json({ error: "token invalid catch" });
        next(error);
    }
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    userExtractor,
};
