const User = require('../models/userModel');
const { body, sanitizeBody, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Login POST
exports.loginPost = (req, res, next) => {
  passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      // failureFlash: true
  })(req, res, next);
}

// Logout GET
exports.logoutGet = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
}

// Signup GET
exports.signupGet = (req, res, next) => {
    res.render('signup_form', { title: 'Sign up' });
}

// Signup POST
exports.signupPost = [
  // Validate and sanitize fields
  body('name').trim().isLength({ min: 1 }).escape().withMessage('Name is required'),
  body('email').trim().isLength({ min: 1 }).escape().isEmail().withMessage('Email is required'),
  body('password').trim().isLength({ min: 1 }).escape().withMessage('Password is required'),
  body("confirmPassword").trim().isLength({ min: 1 }).escape().withMessage("Password must be at least 6 characters.")
    .custom(async (value, { req }) => {
      // Use the custom method w/ a CB func to ensure that both passwords match, return an error if so
      if (value !== req.body.password) throw new Error('Passwords must be the same');
      return true;
    }),

    async (req, res, next) => {
      // Validate the request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // There are errors, render form again with sanitized values/error messages
        res.render('signup_form', { title: 'Invalid password', passworderror: 'Error' });
        return;
      }

      // Check if the user already exists
      const user = await User.findOne({ name: req.body.name });
      if (user) {
        // User already exists, render form again with error message
        res.render('signup_form', { title: 'User already exists', emailerror: "Error" });
        return;
      } else {

        // hash password and create new user
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        member: false,
        admin: false
      });
      newUser.save(err => {
        if (err) {
          return next(err);
        }
        res.redirect('/login');
      }
      ) // end newUser.save;
    } // end else
  } // end async
 ];

// Login GET
exports.loginGet = (req, res, next) => {
    // Check if the user is logged in
    if (res.locals.currentUser) {
        // If they are, redirect them to the home page
        res.redirect('/');
        return;
    }
    else {
        // If they aren't, render the login page
        res.render('login_form', { title: 'Login' });
    }
}

