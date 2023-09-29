let mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    providerId: {
        type: String,
        default: null,
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: [true, "email already registered"],
    },
    passwordHash: String,
    anecdotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Anecdote",
        },
    ],
    displayName: String,
    firstName: String,
    lastName: String,
    profilePhoto: String,
    // uploadPhoto: File,
    source: { type: String, required: [true, "source not specified"] },
    lastVisited: { type: Date, default: new Date() },
    isVerified: Boolean,
    verificationToken: String,
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
    },
});

// module.exports = mongoose.model("User", userSchema);

const User = mongoose.model("User", userSchema);
module.exports = User;
