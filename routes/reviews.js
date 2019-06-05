const express       = require("express"),
      Campground    = require("../models/campground"),
      Review        = require("../models/review"),
      middleware    = require("../middleware"),
      router        = express.Router({mergeParams: true});

// INDEX -- Display all reviews
router.get("/", (req, res) => {
    Campground
        .findById(req.params.campgroundId)
        .populate({
            path: "reviews",
            // Sorting the reviews array to show the latest first.
            options: { sort: { createdAt: -1 } }
        })
        .exec((err, campground) => {
            if (err || !campground) {
                req.flash("error", "Database error, please contact an admin!");
                res.redirect("back");
            } else
                res.render("reviews/index", {campground: campground});
        });
});

// NEW -- Display a form for a new review
router.get("/new", middleware.checkUniqueReview, (req, res) => {
    Campground.findById(req.params.campgroundId, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else
            res.render("reviews/new", {campground: campground});
    });
});

// CREATE -- Add new review to database
router.post("/", middleware.checkUniqueReview, (req, res) => {
    Campground
        .findById(req.params.campgroundId)
        .populate("reviews")
        .exec((err, campground) => {
            if (err || !campground) {
                req.flash("error", "Database error, please contact an admin!");
                return (res.redirect("back"));
            }
            Review.create(req.body.review, (err, review) => {
                if (err || !review) {
                    req.flash("error", "Database error, please contact an admin!");
                    return (res.redirect("back"));
                }
                review.author.id = req.user._id;
                review.author.username = req.user.username;
                review.campground = campground._id;
                review.save();
                campground.reviews.push(review);
                campground.rating = computeAverage(campground.reviews);
                campground.save();
                req.flash("success", "Your review have been successfully added.");
                res.redirect("/campgrounds/" + campground._id);
            });
        });
});

// EDIT -- Display a form for editing a review
router.get("/:reviewId/edit", middleware.checkUserReview, (req, res) => {
    Review.findById(req.params.reviewId, (err, review) => {
        if (err || !review) {
            req.flash("error", "Database error, please contact an admin!");
            return (res.redirect("back"));
        }
        res.render("reviews/edit", { campground_id: req.params.campgroundId, review: review });
    });
});

// UPDATE -- Update the review whith the infomations of EDIT form
router.put("/:reviewId", middleware.checkUserReview, (req, res) => {
    Review.findByIdAndUpdate(req.params.reviewId, req.body.review, { new: true }, (err, review) => {
        if (err || !review) {
            req.flash("error", "Database error, please contact an admin!");
            return (res.redirect("back"));
        }
        Campground
            .findById(req.params.campgroundId)
            .populate("reviews")
            .exec((err, campground) => {
                if (err || !campground) {
                    req.flash("error", "Database error, please contact an admin!");
                    return (res.redirect("back"));
                }
                campground.rating = computeAverage(campground.reviews);
                campground.save();
                req.flash("success", "Your review was successfully updated.");
                res.redirect("/campgrounds/" + campground._id);
            });
    });
});

// DELETE -- Remove the review from the database
router.delete("/:reviewId", middleware.checkUserReview, (req, res) => {
    Review.findByIdAndRemove(req.params.reviewId, (err) => {
        if (err) {
            req.flash("error", "Database error, please contact an admin!");
            return (res.redirect("back"));
        }
        Campground
            .findByIdAndUpdate(req.params.campgroundId, { $pull: { reviews: req.params.reviewId } }, { new: true })
            .populate("reviews")
            .exec((err, campground) => {
                if (err || !campground) {
                    req.flash("error", "Database error, please contact an admin!");
                    return (res.redirect("back"));
                }
                campground.rating = computeAverage(campground.reviews);
                campground.save();
                req.flash("success", "Your review was successfully deleted.");
                res.redirect("/campgrounds/" + campground._id);
            });
    });
});

function computeAverage(reviews) {
    if (reviews.length === 0)
        return (0);
    var sum = 0;
    reviews.forEach((review) => {
        sum += review.rating;
    });
    return (sum / reviews.length);
}

module.exports = router;