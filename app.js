require('dotenv').config();

// ================= //
//  REQUIRE MODULES  //
// ================= //
const express           = require("express"),
      bodyParser        = require("body-parser"),
      methodOverride    = require("method-override"),
      mongoose          = require("mongoose"),
      passport          = require("passport"),
      localStrategy     = require("passport-local"),
      flash             = require("connect-flash"),
      User              = require("./models/user"),
      seedDB            = require("./seedDB"),
      app               = express();

// ================ //
//  REQUIRE ROUTES  //
// ================ //
const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      reviewRoutes      = require("./routes/reviews"),
      userRoutes        = require("./routes/users"),
      indexRoutes       = require("./routes/index");

// ======================= //
//  GENERAL CONFIGURATION  //
// ======================= //
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.locals.moment = require("moment");

// ========= //
//  MONGODB  //
// ========= //
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true})
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log("Database error: " + err.message));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//seedDB();

// ======================== //
//  PASSPORT CONFIGURATION  //
// ======================== //
app.use(require("express-session")({
    secret: "Que Je Sens De Rudes Combats!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============ //
//  MIDDLEWARE  //
// ============ //
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ============ //
//  ADD ROUTES  //
// ============ //
app.use("/users", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:campgroundId/comments", commentRoutes);
app.use("/campgrounds/:campgroundId/reviews", reviewRoutes);
app.use(indexRoutes);

// ================= //
//  STARTING SERVER  //
// ================= //
app.listen(Number(process.env.PORT), process.env.IP, () => {
    console.log("The YelpCamp Server Has Started!");
});