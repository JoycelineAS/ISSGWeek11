const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Session middleware
app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true
}));

// View engine
app.set("view engine", "ejs");

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: "25564201269-lel67lhkh2rddrkkj8bn5eho58fhlos4.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
},
(accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});

// Routes
app.get("/", (req, res) => {
    res.render('index');
});

app.get("/auth/google", passport.authenticate("google", { 
    scope: ["profile", "email"], 
    prompt: "select_account",
}));

app.get(
    "/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
        res.redirect("/profile");
    }
);

app.get("/profile", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect("/auth/google");
    }
    res.render("profile", { user: req.user });
});

app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err); // Jika ada error, teruskan ke middleware error handler
        }
        res.redirect('/'); // Redirect ke halaman utama setelah logout
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
