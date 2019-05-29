const Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      User       = require("../models/user");

const middleware = {};

middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated())
        return (next());
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

middleware.checkUserCampground = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.campgroundId, (err, campground) => {
            if (err || !campground) {
                req.flash("error", "Database error, please contact an admin!");
                res.redirect("back");
            }
            else {
                if (campground.author.id.equals(req.user._id) || req.user.isAdmin)
                    next();
                else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

middleware.checkUserComment = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.commentId, (err, comment) => {
            if (err || !comment) {
                req.flash("error", "Database error, please contact an admin!");
                res.redirect("back");
            }
            else {
                if (comment.author.id.equals(req.user._id) || req.user.isAdmin)
                    next();
                else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

middleware.checkUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.userId, (err, user) => {
            if (err || !user) {
                req.flash("error", "Database error, please contact an admin!");
                res.redirect("back");
            }
            else {
                if (user._id.equals(req.user._id) || req.user.isAdmin)
                    next();
                else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}

module.exports = middleware;