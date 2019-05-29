const express       = require("express"),
      router        = express.Router({mergeParams: true}),
      Campground    = require("../models/campground"),
      Comment       = require("../models/comment"),
      middleware    = require("../middleware");

// NEW -- Display a form for a new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.campgroundId, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        }
        else
            res.render("comments/new", {campground: campground});
    });
});

// CREATE -- Add new comment to database
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.campgroundId, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err || !comment) {
                    req.flash("error", "Database error, please contact an admin!");
                    res.redirect("back");
                }
                else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Your comment have been successfully added!");
                    res.redirect("/campgrounds/" + req.params.campgroundId);
                }
            });
        }
    });
});

// EDIT -- Display a form for editing a comment
router.get("/:commentId/edit", middleware.checkUserComment, (req, res) => {
    Campground.findById(req.params.campgroundId, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        }
        else {
            Comment.findById(req.params.commentId, (err, comment) => {
                if (err || !comment) {
                    req.flash("error", "Database error, please contact an admin!");
                    res.redirect("back");
                }
                else
                    res.render("comments/edit", {campground: campground, comment: comment});
            });
        }
    });
});

// UPDATE -- Update the comment whith the infomations of EDIT form
router.put("/:commentId", middleware.checkUserComment, (req, res) => {
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, (err, comment) => {
        if (err || !comment) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        }
        else {
            req.flash("success", "Your comment have been successfully updated!");
            res.redirect("/campgrounds/" + req.params.campgroundId);
        }
    });
});

// DELETE -- Remove the comment from the database
router.delete("/:commentId", middleware.checkUserComment, (req, res) => {
    Campground.findById(req.params.campgroundId, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        }
        else {
            campground.comments = campground.comments.filter(comment => !(comment.equals(req.params.id2)));
            campground.save();
            Comment.findByIdAndRemove(req.params.commentId, (err) => {
                if (err) {
                    req.flash("error", "Database error, please contact an admin!");
                    res.redirect("back");
                }
                else {
                    req.flash("success", "Your comment have been successfully deleted!");
                    res.redirect("/campgrounds/" + req.params.campgroundId);
                }
            });
        }
    });
});

module.exports = router;