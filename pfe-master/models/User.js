const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const keys = require("../config/keys");
const jwt = require('jsonwebtoken');
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  /*
  password: {
    type: String,
    required: true
  },
  */
  salt: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email", 
  passwordField: "password"
});
UserSchema.plugin(mongoosePaginate);

UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    password:this.password
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, keys.secretOrKey);
}

module.exports = User = mongoose.model("users", UserSchema);

