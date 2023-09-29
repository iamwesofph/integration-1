const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Mailgen = require("mailgen");

usersRouter.post("/api/users", async (request, response) => {
    const { displayName, name, password, email, source } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(20).toString("hex");

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

    // Send a verification email to the user
    const verificationLink = `http://yourapp.com/verify/${verificationToken}`;
    // const mailOptions = {
    //     from: "wes_express@gmail.com",
    //     to: email,
    //     subject: "Email Verification",
    //     html: `<p>Please verify your email by clicking <a href="${verificationLink}">here</a></p>`,
    // };

    // let message = {
    //     from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //     to: "bar@example.com, baz@example.com", // list of receivers
    //     subject: "Hello ✔", // Subject line
    //     text: "Successfully Register with us.", // plain text body
    //     html: "<b>Successfully registered with us.</b>", // html body
    // };

    // transporter.sendMail(mailOptions, (error) => {
    //     if (error) {
    //         console.error("Error sending verification email: ", error);
    //         response.status(500).json({ error: "Error sending verification email" });
    //     } else {
    //         response.status(201).json({ message: "User registered. Please check your email for verification." });
    //     }
    // });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const MailGenerator = new Mailgen({
        theme: "cerberus",
        product: {
            name: "Wesbook",
            link: "https://github.com/iamwesofph/",
        },
    });

    // const email = {
    //     body: {
    //         name: "Daily Tuition",
    //         intro: "Your bill has arrived!",
    //         table: {
    //             data: [
    //                 {
    //                     item: "Nodemailer Stack Book",
    //                     description: "A Backend application",
    //                     price: "$10.99",
    //                 },
    //             ],
    //         },
    //         outro: "Looking forward to do more business",
    //     },
    // };

    const emailBody = {
        body: {
            name: displayName,
            intro: "Welcome to Wesbook! We're very excited to have you on board.",
            action: {
                instructions: "To get started with Wesbook, please click here:",
                button: {
                    color: "##22d3ee",
                    text: "Verify your email",
                    link: verificationLink,
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
        },
    };

    const mail = MailGenerator.generate(emailBody);

    const envelope = {
        from: process.env.EMAIL,
        to: email,
        subject: "Place Order",
        html: mail,
    };

    transporter
        .sendMail(envelope)
        .then(() => {
            return response.status(201).json({
                msg: "you should receive an email",
            });
        })
        .catch((error) => {
            console.log("ERROR IN TRANSPORTER SENDMAIL");
            return response.status(500).json({ error });
        });

    // transporter
    //     .sendMail(message)
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

    // response.status(201).json(savedUser);
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
