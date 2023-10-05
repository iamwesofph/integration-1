const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");
const middleware = require("../utils/middleware");

loginRouter.post("/api/login-local", async (request, response) => {
    const { email, password } = request.body;
    console.log(request.body);
    const user = await User.findOne({ email });
    console.log("USER");
    console.log(user);

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: "invalid email or password",
        });
    } else {
        console.log("Password is valid");
    }

    const userForToken = { id: user._id };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60 * 60 });
    console.log(`LOGINROUTER TOKEN ${token}`);
    response.status(200).send(token);
});

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
