const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

usersRouter.post("/api/users", async (request, response) => {
    const { displayName, name, password, email, source } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const verificationToken = await bcrypt.hash("hex", saltRounds);

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

    const verificationLink = `http://yourapp.com/verify/${verificationToken}`;
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

    // const emailBody = {
    //     body: {
    //         name: displayName,
    //         intro: "Welcome to Wesbook! We're very excited to have you on board.",
    //         action: {
    //             instructions: "To get started with Wesbook, please click here:",
    //             button: {
    //                 color: "#22d3ee",
    //                 text: "Verify your email",
    //                 link: verificationLink,
    //             },
    //         },
    //         outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    //     },
    // };

    // const mail = MailGenerator.generate(emailBody);

    // const envelope = {
    //     from: process.env.EMAIL,
    //     to: email,
    //     subject: "Place Order",
    //     html: mail,
    // };

    // transporter
    //     .sendMail(mailOptions)
    //     .then(() => {
    //         return response.status(201).json({
    //             msg: "you should receive an email",
    //         });
    //     })
    //     .catch((error) => {
    //         console.log("ERROR IN TRANSPORTER SENDMAIL");
    //         return response.status(500).json({ error });
    //     });

    // Step 4
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log("Error occurs");
            console.log(err);
            return;
        }
        return console.log("Email sent!!!");
    });

    // transporter
    //     .sendMail(mailOptions)
    //     .then((info) => {
    //         return response.status(201).json({
    //             msg: "you should receive an email",
    //             info: info.messageId,
    //             preview: nodemailer.getTestMessageUrl(info),
    //         });
    //     })
    //     .catch((error) => {
    //         return response.status(500).json({ error });
    //     });
});

usersRouter.get("/api/users", async (request, response) => {
    try {
        const users = await User.find({});
        response.json(users);
    } catch (error) {
        response.status(500).json({ error: "An error occured while fetching users" });
    }
});

module.exports = usersRouter;
