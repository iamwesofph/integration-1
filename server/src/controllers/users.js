const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const config = require("../utils/config");

usersRouter.post("/api/users", async (request, response, next) => {
    const { displayName, name, password, email, source } = request.body;
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
            isVerified: false,
            verificationToken,
            // uploadPhoto,
        });

        const savedUser = await user.save();

        const verificationLink = `http://localhost:3001/api/verify-email/?token=${verificationToken}`;
        console.log(verificationLink);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        // Step 2
        transporter.use(
            "compile",
            hbs({
                viewEngine: "express-handlebars",
                viewPath: "./",
            })
        );

        // Step 3
        const mailOptions = {
            from: "tabbnabbers@gmail.com", // TODO: email sender
            to: email, // TODO: email receiver
            subject: "Nodemailer - Test",
            text: "Wooohooo it works!!",
            template: "main",
            context: {
                name: displayName,
                verificationLink: verificationLink,
            }, // send extra values to template
        };

        // Step 4
        transporter.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log("Error occurs");
                console.log(err);
                return;
            }
            return console.log("Email sent!!!");
        });
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
