const express       = require("express"),
      nodeGeocoder  = require("node-geocoder"),
      Campground    = require("../models/campground"),
      Comment       = require("../models/comment"),
      Review        = require("../models/review"),
      middleware    = require("../middleware"),
      router        = express.Router();

const geocoder = nodeGeocoder({
    provider: "google",
    httpAdapter: "https",
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
});

// INDEX -- Display all campgrounds
router.get("/", (req, res) => {
    const perPage = 8;
    const pageQuery = parseInt(req.query.page);
    const pageNumber = pageQuery ? pageQuery : 1;
    Campground
        .find({})
        .skip((perPage * pageNumber) - perPage)
        .limit(perPage)
        .exec((err, campgrounds) => {
            if (err) {
                req.flash("error", "Database error, please contact an admin!");
                return (res.redirect("back"));
            }
            Campground.countDocuments().exec((err, count) => {
                if (err) {
                    req.flash("error", "Database error, please contact an admin!");
                    res.redirect("back");
                } else {
                    res.render("campgrounds/index", {
                        campgrounds: campgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        page: "campgrounds"
                    });
                }
            });
        });
});

// CREATE -- Add new campground to database
router.post("/", middleware.isLoggedIn, (req, res) => {
    geocoder.geocode(req.body.location, (err, data) => {
        if (err || !data.length) {
            console.log(err);
            req.flash("error", "Invalid address");
            return (res.redirect("back"));
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        Campground.create(req.body.campground, (err, campground) => {
            if (err || !campground) {
                req.flash("error", "Database error, please contact an admin!");
                return (res.redirect("back"));
            } else {
                campground.author = {
                    id: req.user._id,
                    username: req.user.username
                }
                campground.save();
                req.flash("success", "The campground: " + req.body.campground.name + " have been created!");
                res.redirect("/campgrounds/" + campground._id);
            }
        });
    });
});

// NEW -- Display a form for a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// SHOW -- Display a particular campground
router.get("/:campgroundId", (req, res) => {
    Campground
        .findById(req.params.campgroundId)
        .populate("comments")
        .populate({
            path: "reviews",
            options: { sort: { createdAt: -1 } }
        })
        .exec((err, campground) => {
            if (err || !campground) {
                req.flash("error", "Database error, please contact an admin!");
                return (res.redirect("back"));
            }
            res.render("campgrounds/show", {campground: campground});
        });
});

// EDIT -- Display a form for editing a campground
router.get("/:campgroundId/edit", middleware.checkUserCampground, (req, res) => {
    Campground.findById(req.params.campgroundId, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else
            res.render("campgrounds/edit", {campground: campground});
    });
});

// UPDATE -- Update the post whith the infomations of EDIT form
router.put("/:campgroundId", middleware.checkUserCampground, (req, res) => {
    // Security to avoid unwanted change on rating property
    delete req.body.campground.rating;
    Campground.findByIdAndUpdate(req.params.campgroundId, req.body.campground, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            res.redirect("back");
        } else {
            if (req.body.location !== campground.location) {
                geocoder.geocode(req.body.location, (err, data) => {
                    if (err || !data.length) {
                        req.flash("error", "Invalid address");
                        return (res.redirect("back"));
                    }
                    campground.lat = data[0].latitude;
                    campground.lng = data[0].longitude;
                    campground.location = data[0].formattedAddress;
                    campground.save();
                });
            }
            req.flash("success", "The campground: " + req.body.campground.name + " have been updated!");
            res.redirect("/campgrounds/" + req.params.campgroundId);
        }
    });
});

// DELETE -- Remove the post from the database
router.delete("/:campgroundId", middleware.checkUserCampground, (req, res) => {
    Campground.findById(req.params.campgroundId, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "Database error, please contact an admin!");
            return (res.redirect("back"));
        }
        Comment.deleteMany({ "_id": { $in: campground.comments } }, (err) => {
            if (err) {
                req.flash("error", "Database error, please contact an admin!");
                return (res.redirect("back"));
            }
        });
        Review.deleteMany({ "_id": { $in: campground.reviews } }, (err) => {
            if (err) {
                req.flash("error", "Database error, please contact an admin!");
                return (res.redirect("back"));
            }
        });
        campground.remove();
        req.flash("success", campground.name + " have been deleted!");
        res.redirect("/campgrounds");
    });
});

module.exports = router;