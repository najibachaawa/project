const express = require("express");
const router = express.Router();
const passport = require("passport");
const { promisify } = require('util');
const crypto = require('crypto');
const transport = require("../../services/mailer")

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");



router.get('/', (req, res) => {
  const i = 5;
});

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res, next) => {
  // Form validation
  var user = req.body;
  const { errors, isValid } = validateRegisterInput(user);

  // Check validation
  if (!isValid) {
    return res.status(200).json(errors);
  }

  User.register(new User({ name: req.body.name, email: req.body.email }), req.body.password,
    function (err) {
      if (err) {
        console.log('error while user register!', err);
        return res.status(200).json({
          "message": "A user with the given username is already registered"
        });
      }
      passport.authenticate('local', {
        usernameField: 'email',
        passwordField: 'password'
      },
        function (err, user, info) {
          if (err) {
            return res.status(200).json({
              "message": err
            });
          }
          if (user) {
            const token = user.generateJWT();
            return res.status(200).json({
              "jwtToken": token
            });
          } else {
            res.status(200).json({
              "message": err
            });
          }
        })(req, res, next)
    });
});



// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res, next) => {

  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  var user = req.body;
  passport.authenticate('local', {
    usernameField: 'email',
    passwordField: 'password'
  },
    function (err, user, info) {
      if (err) {
        return res.status(200).json({
          "message": err
        });
      }
      if (user) {
        const token = user.generateJWT();
        return res.status(200).json({
          "jwtToken": token,
          "email": user.email,
          "name": user.name,
          "role": user.role,
        });
      } else {
        res.status(200).json({
          "message": err
        });
      }
    })(req, res, next)
});

router.post("/forgot_password", async (req, res, next) => {
  User.findOne({ email: req.body.email }, async (err, user) => {
    // Check if error connecting
    if (err) {
      res.json({ success: false, message: err }); // Return error
    } else {
      // Check if user was found in database
      if (!user) {
        res.json({ success: false, message: 'User not found' }); // Return error, user was not found in db
      } else {
        const token = (await promisify(crypto.randomBytes)(20)).toString('hex');

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();
        const resetEmail = {
          to: user.email,
          from: 'passwordreset@crmpfe.com',
          subject: 'Password Reset',
          text: `
      You are receiving this because you (or someone else) have requested the reset of the password for your account.
      Please click on the following link, or paste this into your browser to complete the process:
      http://${req.headers.host}/user/reset-password/${token}
      If you did not request this, please ignore this email and your password will remain unchanged.`,
        };

        await transport.sendMail(resetEmail);
        res.status(200).json({
          "status": "success"
        });
      }
    }
  });





});

router.post("/change_password/:token", async (req, res, next) => {
  /*var user = User.find(u => (
    (u.resetPasswordExpires > Date.now()) &&
    crypto.timingSafeEqual(Buffer.from(u.resetPasswordToken), Buffer.from(req.params.token))
    ));*/
  var user = User.findOne({ 'resetPasswordToken': req.params.token },
    async (err, returneduser) => {
      if (!user) {
        console.log("No user exists");
      }
      if (req.body.password === req.body.confirm) {
        returneduser.setPassword(req.params.password, function () {
          delete returneduser.resetPasswordToken;
          delete returneduser.resetPasswordExpires;
          returneduser.save();
        });

        const resetEmail = {
          to: returneduser.email,
          from: 'passwordreset@crmpfe.com',
          subject: 'Your password has been changed',
          text: `
          This is a confirmation that the password for your account "${returneduser.email}" has just been changed.
        `
        };

        await transport.sendMail(resetEmail);
        res.status(200).json({
          "message": "Success! Your password has been changed."
        });
      } else {
        res.status(200).json({
          "message": "Password change failed."
        });
      }
    }
  );
});

router.get('/facebook', passport.authenticate('facebook'), );

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/user/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
});

router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/user/login' }),
  function(req, res) {
    var user = req.user;
    var account = req.account;
    // Associate the Twitter account with the logged-in user.
    account.userId = user.id;
    account.save(function(err) {
      if (err) { return self.error(err); }
      self.redirect('/');
    });
  });

module.exports = router;
