const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const middleware = require("../utils/middleware");

// This route validates the giver password and email, sends the browser the JWT
loginRouter.post("/api/login-local", async (request, response, next) => {
    const { email, password } = request.body;

    // Find all users with the given email
    // Compare if any of the users password hash match the password given.
    // If one matches, then fetch ID of that user
    const user = await User.findOne({ email }); //TODO fix bug of finding an unverified user

    try {
        const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

        if (!(user && passwordCorrect)) {
            response.status(401).json({ error: "Invalid email or password" });
        } else {
            console.log("Password is valid");
            const userForToken = { id: user._id };
            const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });
            // console.log(`LOGINROUTER TOKEN ${token}`);
            response.status(200).send(token);
        }
    } catch (error) {
        next(error);
    }
});

// This route uses the JWT sent via header to find the associated user from DB and return the user in response
loginRouter.get("/api/login-local/success", middleware.userExtractor, function (req, res) {
    console.log("LOGIN CONTROLLER");
    console.log(req.user);
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    } else if (!req.user) {
        res.status(403).json({ error: true, message: req.session.messages });
    }
});

module.exports = loginRouter;
