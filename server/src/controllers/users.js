const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/api/users", async (request, response) => {
    const { displayName, name, password, email, source, verified } = request.body;
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
        displayName,
        name,
        passwordHash,
        email,
        source,
        verified,
        // uploadPhoto,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
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
