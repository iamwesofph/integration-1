const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");
const sendEmail = require("../utils/sendEmail");

usersRouter.post("/api/users", async (request, response, next) => {
    const { displayName, name, password, email, source, isVerified } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const verificationToken = await bcrypt.hash(email, saltRounds);
    try {
        const user = new User({
            displayName,
            name,
            passwordHash,
            email,
            source,
            isVerified,
            verificationToken,
            // uploadPhoto,
        });

        const savedUser = await user.save();
        response.json(savedUser);

        const verificationLink = `http://localhost:3001/api/verify-email/?token=${verificationToken}`;
        console.log(verificationLink);

        // sendEmail(email, displayName, verificationLink);
    } catch (error) {
        next(error);
    }
});

usersRouter.get("/api/users", async (request, response, next) => {
    try {
        const users = await User.find({}).populate("anecdotes");
        response.json(users);
    } catch (error) {
        // response.status(500).json({ error: "An error occured while fetching users" });
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
