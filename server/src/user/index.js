const User = require("../models/user");
const UserService = require("./user.service");

module.exports = UserService(User);
