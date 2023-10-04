const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const User = require("../models/user");

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
    }

    const userForToken = { id: user._id };

    const token = jwt.sign(userForToken, process.env.SECRET);

    response.status(200).send({ token });
});

module.exports = loginRouter;
