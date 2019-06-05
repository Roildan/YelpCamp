const express       = require("express"),
      passport      = require("passport"),
      User          = require("../models/user"),
      Campground    = require("../models/campground"),
      middleware    = require("../middleware"),
      router        = express.Router();

// Landing page
router.get("/", (req, res) => {
    res.render("landing");
});

// NEW -- Display a form for register a new user
router.get("/register", (req, res) => {
    res.render("register", {page: "register"});
});

// CREATE -- Add a new user to database
router.post("/register", (req, res) => {
    const newUser = new User({ username: req.body.username, email: req.body.email });
    if (req.body.adminCode === process.env.ADMIN_CODE)
        newUser.isAdmin = true;
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            return (res.redirect("/register"));
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome " + user.username + "! I hove you will enjoy YelpCamp :)");
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN -- Display a form to log as user
router.get("/login", (req, res) => {
    res.render("login", {page: "login"});
});

// LOGIN -- Handle the login demands
router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err)
            return (next(err));
        if (!user) {
            req.flash("error", "Invalid username or password.")
            return (res.redirect("/login"));
        }
        req.logIn(user, (err) => {
            if (err)
                return next(err);
            req.flash("success", "Welcome Back " + user.username + "!");
            return (res.redirect("/campgrounds"));
        });
    })(req, res, next);
});

// LOGOUT -- Logout the current user
router.get("/logout", middleware.isLoggedIn, (req, res) => {
    const user = req.user.username;
    req.logout();
    req.flash("success", "Goodbye " + user + "! Have a nice day :)");
    res.redirect("/campgrounds");
});

// MAP -- Display a map with all campgrounds
router.get("/map", (req, res) => {
    Campground.find({}, (err, campgrounds) => {
        if (err) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else
            res.render("map", {campgrounds: campgrounds, page: "map"});
    });
});

// Wrong Url
router.get("/*", (req, res) => {
    res.redirect("/campgrounds");
});

module.exports = router;