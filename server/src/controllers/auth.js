const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2");
const User = require("../models/user");
const config = require("../utils/config");

const router = express.Router();

passport.use(
    new FacebookStrategy(
        {
            callbackURL: config.FACEBOOK_CALLBACK_URL,
            clientID: config.FACEBOOK_CLIENT_ID,
            clientSecret: config.FACEBOOK_CLIENT_SECRET,
            state: true, // Enable the state parameter for CSRF protection
            // scope: ["public_profile"],
            profileFields: ["id", "displayName", "emails", "photos", "first_name", "last_name", "middle_name", "name_format"],
        },
        async (accessToken, refreshToken, profile, done) => {
            // console.log(`INSIDE FACEBOOK ${JSON.stringify(profile)}`);
            console.log(profile.id);
            // console.log(profile.displayName);
            // console.log(profile.picture);
            // console.log(profile.first_name);
            // console.log(profile.last_name);
            // console.log(profile.emails[0].value);
            console.log(profile._json);

            try {
                const providerId = profile.id;
                const email = profile.emails[0].value;
                const displayName = profile.displayName;
                const profilePhoto = profile.photos[0].value;
                const firstName = profile.name.givenName;
                const lastName = profile.name.familyName;
                const currentUser = await User.findOne({ email: email });
                console.log(`CURRENT USER: ${currentUser}`);
                console.log(`PROFILE ID: ${profile.id}`);
                console.log(`PROVIDER ID: ${providerId}`);

                if (!currentUser) {
                    console.log("No CURRENT USER");
                    const newUser = new User({
                        providerId,
                        email,
                        displayName,
                        firstName,
                        lastName,
                        profilePhoto,
                        source: "facebook",
                    });

                    await newUser.save();
                    return done(null, newUser);
                }

                if (currentUser.source != "facebook") {
                    return done(null, false, { message: `We were unable to log you in with that login method. Log in with the current social provider linked to your account, either Google or GitHub.` });
                }

                currentUser.lastVisited = new Date();
                return done(null, currentUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new GoogleStrategy(
        {
            // clientID: process.env["GOOGLE_CLIENT_ID"],
            // clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
            // callbackURL:
            //     process.env.NODE_ENV === "production" // Need to specify complete URL for production to work because redirect URI is checked by facebook and google.
            //         ? "https://google-facebook-authentication.onrender.com/oauth2/redirect/google" //TODO
            //         : "/auth/google/callback",
            // scope: ["profile", "email"],
            // callbackURL: process.env.CALLBACK_URL,
            callbackURL: config.GOOGLE_CALLBACK_URL,
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(`INSIDE GOOGLESTRATEGY ${JSON.stringify(profile)}`);
            try {
                const providerId = profile.id;
                const email = profile.emails[0].value;
                const firstName = profile.name.givenName;
                const lastName = profile.name.familyName;
                const profilePhoto = profile.photos[0].value;

                const currentUser = await User.findOne({ email });

                if (!currentUser) {
                    const newUser = new User({
                        providerId,
                        email,
                        firstName,
                        lastName,
                        profilePhoto,
                        source: "google",
                    });

                    await newUser.save();
                    return done(null, newUser);
                }

                if (currentUser.source != "google") {
                    return done(null, false, { message: `We were unable to log you in with that login method. Log in with the current social provider linked to your account, either Google or GitHub.` });
                }

                currentUser.lastVisited = new Date();
                return done(null, currentUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: config.GITHUB_CLIENT_ID,
            clientSecret: config.GITHUB_CLIENT_SECRET,
            callbackURL: config.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(`INSIDE GITHUB STRATEGY ${JSON.stringify(profile)}`);
            try {
                const providerId = profile.id;
                const displayName = profile.displayName;
                const email = profile.emails[0].value;
                const profilePhoto = profile.photos[0].value;
                console.log(`PROVIDER ID: ${providerId}`);
                console.log(`EMAIL: ${email}`);
                console.log(`PROFILE PHOTO: ${profilePhoto}`);

                const currentUser = await User.findOne({ email });

                if (!currentUser) {
                    console.log("User email not found on users DB");
                    const newUser = new User({
                        providerId,
                        displayName,
                        email,
                        profilePhoto,
                        source: "github",
                    });

                    await newUser.save();
                    return done(null, newUser);
                }

                if (currentUser.source != "github") {
                    console.log("User email found using another provider");
                    return done(null, false, { message: `Sorry! We were unable to log you in with that login method.\nPlease log in with the current social provider linked to your account, either Google or GitHub.` });
                }

                currentUser.lastVisited = new Date();
                return done(null, currentUser);
            } catch (error) {
                return done(error);
            }
        }
    )
);

var LocalStrategy = require("passport-local");
var crypto = require("crypto");

passport.use(
    new LocalStrategy(function verify(username, password, done) {
        // db.get("SELECT * FROM users WHERE username = ?", [username], function (err, user) {
        //     if (err) {
        //         return cb(err);
        //     }
        //     if (!user) {
        //         return cb(null, false, { message: "Incorrect username or password." });
        //     }
        //     crypto.pbkdf2(password, user.salt, 310000, 32, "sha256", function (err, hashedPassword) {
        //         if (err) {
        //             return cb(err);
        //         }
        //         if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
        //             return cb(null, false, { message: "Incorrect username or password." });
        //         }
        //         return cb(null, user);
        //     });
        // });
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

router.get("/auth/login/success", function (req, res) {
    console.log("REQ = ", req.session.messages);

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

// Login button redirects to this route
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// Google redirects to this route
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: `${config.FRONTEND_URL}/login`,
        successRedirect: config.FRONTEND_URL,
    })
);

// Login button redirects to this route
// router.get("/auth/facebook", passport.authenticate("facebook", { scope: ["public_profile"] }));
router.get("/auth/facebook", passport.authenticate("facebook"));

// Google redirects to this route
router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
        failureRedirect: `${config.FRONTEND_URL}/login`,
        successRedirect: config.FRONTEND_URL,
    })
);

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
    "/auth/github/callback",
    passport.authenticate("github", {
        failureRedirect: `${config.FRONTEND_URL}/login`,
        successRedirect: config.FRONTEND_URL,
        failureMessage: true, // Capture failure message
        // failureRedirect: `http://localhost:1111`,
        // successRedirect: `http://localhost:8888`,
    })
);

router.get("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
        }
    });
    res.redirect(config.FRONTEND_URL);
});

module.exports = router;
