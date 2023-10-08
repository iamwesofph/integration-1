const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const { body } = require("express-validator");

const User = require("../models/user");
const config = require("../utils/config");
const { validateRequestSchema } = require("../utils/middleware");

usersRouter.post(
    "/api/users",
    body("email").escape().notEmpty().withMessage("Email is required").isEmail().withMessage("Please provide a valid email"),
    body("displayName").escape().trim().notEmpty().withMessage("Display name is required"),
    body("password").escape().notEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password length minimum of 8 characters"),
    validateRequestSchema,

    async (request, response, next) => {
        const { displayName, password, email } = request.body;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const verificationToken = await bcrypt.hash(email, saltRounds);
        const source = "local";
        const isVerified = false;

        try {
            const user = new User({
                email,
                displayName,
                passwordHash,
                source,
                isVerified,
                verificationToken,
                // uploadPhoto,
            });

            const savedUser = await user.save();
            response.json(savedUser);
        } catch (error) {
            //MONGOOSE ERRORS go here when save fails
            next(error);
        }
    }
);

usersRouter.get("/api/users", async (request, response, next) => {
    try {
        const users = await User.find({}).populate("anecdotes");
        response.json(users);
    } catch (error) {
        next(error);
    }
});

usersRouter.get("/api/verify-email", async (req, res) => {
    const token = req.query.token;

    // if the user is already verified, then show a different page
    const user = await User.findOne({ verificationToken: token });
    if (user.isVerified) {
        res.redirect(`${config.FRONTEND_URL}/verification-nothing`);
    } else {
        user.isVerified = true;
        await user.save();
        res.redirect(`${config.FRONTEND_URL}/verification-successful`);
    }
    // res.status(200).json(`${user.email} is now verified`);
});

module.exports = usersRouter;
