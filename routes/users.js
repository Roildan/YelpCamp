const express       = require("express"),
      User          = require("../models/user"),
      Campground    = require("../models/campground"),
      middleware    = require("../middleware"),
      router        = express.Router();

// SHOW -- Display user home page
router.get("/:userId", (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err || !user) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else {
            Campground.find({ "author.username": user.username }, (err, campgrounds) => {
                if (err) {
                    req.flash("error", "Database error, please contact an admin!");
                    res.redirect("back");
                } else {
                    res.render("users/show", {user: user, campgrounds: campgrounds, page: "user"});
                }
            });
        }
    });
});

// EDIT -- Display user's edit page
router.get("/:userId/editIdentity", middleware.checkUser, (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err || !user) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else {
            res.render("users/editIdentity", {user: user, page: "user"});
        }
    });
});

// EDIT -- Display user's edit page
router.get("/:userId/editAddress", middleware.checkUser, (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err || !user) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else {
            res.render("users/editAddress", {user: user, page: "user"});
        }
    });
});

// UPDATE -- Update the user profile with the informations of EDIT form
router.put("/:userId", middleware.checkUser, (req, res) => {
    User.findByIdAndUpdate(req.params.userId, req.body.user, (err, user) => {
        if (err || !user) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else {
            req.flash("success", "Your profile have been updated!");
            res.redirect("/users/" + req.params.userId);
        }
    });
});

module.exports = router;