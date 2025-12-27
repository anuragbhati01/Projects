const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportLocalMongoose); // By this passportLocalMongoose will automatically add username and password in hashed and salted form

module.exports = mongoose.model("User", userSchema);