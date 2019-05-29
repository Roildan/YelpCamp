const mongoose              = require("mongoose"),
      passportLocalMangoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  avatar: { type: String, default: "" },
  email: { type: String, unique: true, required: true },
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  address: {
    address1: { type: String, default: "" },
    address2: { type: String, default: "" },
    city: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" }
  },
  isAdmin: { type: Boolean, default: false }
});

UserSchema.plugin(passportLocalMangoose);

module.exports = mongoose.model("User", UserSchema);