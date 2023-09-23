const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const config = require("../utils/config");

const router = express.Router();

// passport.use(
//     new FacebookStrategy(
//         {
//             clientID: process.env["FACEBOOK_CLIENT_ID"],
//             clientSecret: process.env["FACEBOOK_CLIENT_SECRET"],
//             callbackURL:
//                 process.env.NODE_ENV === "production" // Need to specify complete URL for production to work because redirect URI is checked by facebook and google.
//                     ? "https://google-facebook-authentication.onrender.com/oauth2/redirect/facebook"
//                     : "/oauth2/redirect/facebook",
//             state: true,
//         },
//         function verify(accessToken, refreshToken, profile, cb) {
//             db.get("SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?", ["https://www.facebook.com", profile.id], function (err, row) {
//                 if (err) {
//                     return cb(err);
//                 }
//                 if (!row) {
//                     db.run("INSERT INTO users (name) VALUES (?)", [profile.displayName], function (err) {
//                         if (err) {
//                             return cb(err);
//                         }

//                         var id = this.lastID;
//                         db.run("INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)", [id, "https://www.facebook.com", profile.id], function (err) {
//                             if (err) {
//                                 return cb(err);
//                             }
//                             var user = {
//                                 id: id,
//                                 name: profile.displayName,
//                             };
//                             return cb(null, user);
//                         });
//                     });
//                 } else {
//                     db.get("SELECT * FROM users WHERE id = ?", [row.user_id], function (err, row) {
//                         if (err) {
//                             return cb(err);
//                         }
//                         if (!row) {
//                             return cb(null, false);
//                         }
//                         return cb(null, row);
//                     });
//                 }
//             });
//         }
//     )
// );

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
            // console.log(`INSIDE GOOGLESTRATEGY ${JSON.stringify(profile)}`);
            try {
                const id = profile.id;
                const email = profile.emails[0].value;
                const firstName = profile.name.givenName;
                const lastName = profile.name.familyName;
                const profilePhoto = profile.photos[0].value;

                const currentUser = await User.findOne({ email });

                if (!currentUser) {
                    const newUser = new User({
                        id,
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

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

router.get("/auth/login/success", function (req, res) {
    if (req.user) {
        res.status(200).json({
            error: false,
            message: "Successfully Logged In",
            user: req.user,
        });
    } else {
        res.status(403).json({ error: true, message: "Not Authorized" });
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
        failureRedirect: "/",
        successRedirect: config.FRONTEND_URL,
        // failureFlash: true,
        // successFlash: "Successfully logged in!",
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
