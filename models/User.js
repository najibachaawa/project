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
    default:"",
    required: true
  },
  lastname: {
    type: String,
    default:"",
    required: false
  },
  role: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default:""
  },
  imageUrl: {
    type: String,
    default:""
  },
  birthDay: {
    type: Date,
    default:new Date()
  },
  disposabilityDate: {
    type: Date,
    default:new Date()
  },
  salt: {
    type: String,
    required: true
  },
  convs:[
    {type:String,
    unique:true}
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date
},{timestamps : true});

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
    password:this.password,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, keys.secretOrKey);
}

module.exports = User = mongoose.model("users", UserSchema);

