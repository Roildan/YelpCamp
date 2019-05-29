const Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      nodeGeocoder  = require("node-geocoder");
 
const seeds = [
  {
    name: "Cloud's Rest",
    image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
    price: 5.99,
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    location: "Bois de Boulogne, Paris"
  },
  {
    name: "Desert Mesa",
    price: 0,
    image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    location: "Désert du Thar"
  },
  {
    name: "Canyon Floor",
    price: 10,
    image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
    location: "Grand Canyon"
  }
]

const geocoder = nodeGeocoder({
  provider: "google",
  httpAdapter: "https",
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
});
 
async function seedDB() {
  try {
    await User.deleteMany({});
    console.log("Users removed!");
    await Campground.deleteMany({});
    console.log("Campgrounds removed!");
    await Comment.deleteMany({});
    console.log("Comments removed!");

    const newUser = new User({username: "Roildan", email: "arthurmoulin@hotmail.fr",isAdmin: true});
    let user = await User.register(newUser, "test");
    console.log("User: " + user.username + " created! (password: test)");
    for (const seed of seeds) {
      seed.author = { id: user._id, username: user.username };
      let locationData = await geocoder.geocode(seed.location);
      seed.lat = locationData[0].latitude;
      seed.lng = locationData[0].longitude;
      seed.location = locationData[0].formattedAddress;
      let campground = await Campground.create(seed);
      console.log("Campground: " + campground.name + " created!");
      let comment = await Comment.create(
        {
          text: "This place is great, but I wish there was internet",
          author: { id: user._id, username: user.username }
        }
      );
      console.log("Comments created!");
      campground.comments.push(comment);
      campground.save();
      console.log("Comment added to " + campground.name + "!");
    }
  } catch(err) {
    console.log(err);
  }
}
 
module.exports = seedDB;