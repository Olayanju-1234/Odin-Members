const User = require('../models/userModel');
const { body, validationResult } = require('express-validator');

// Join members GET
exports.membersGet = (req, res, next) => {
    // Check if the user is logged in
    if (res.locals.currentUser) {
        // If they are, render the join members page
        res.render('member_form', { title: 'Join Members', user: res.locals.currentUser });
    }
    else {
        // If they aren't, redirect them to the login page
        res.redirect('/login');
    }
}

// Join members POST
exports.membersPost = [
    body('membercode').isLength({ min: 1 }).escape().withMessage('Please enter a member code.'),

    
    (req, res, next) => {
        // Get the validation result
        const errors = validationResult(req);
        // Check if there are any errors
        if (!errors.isEmpty()) {
            // If there are, render the join members page with the errors
            res.render('member_form', { title: 'Join Members', errors: errors.array(), user: res.locals.currentUser });
            return;
        }
       else if (req.body.membercode != '123456') {
            // If there aren't, render the join members page with an error
            res.render('member_form', { title: 'Join Members', error: 'Invalid member code.', user: res.locals.currentUser });
            return;
        }

        const user = new User(res.locals.currentUser);
        user.member = true;

        User.findOneAndUpdate({ _id: res.locals.currentUser._id }, user, { new: true }, (err, user) => {
            if (err) return next(err);
            // If there are no errors, redirect to the home page
            res.redirect('/');
        }
        );
    }
]

// Join admins GET
exports.adminsGet = (req, res, next) => {
    // Check if the user is logged in
    if (res.locals.currentUser) {
        // If they are, render the join admins page
        res.render('admin_form', { title: 'Join Admins', user: res.locals.currentUser });
    }
    else {
        // If they aren't, redirect them to the login page
        res.redirect('/login');
    }
}

// Join admins POST
exports.adminsPost = [
    body('admincode').isLength({ min: 1 }).escape().withMessage('Please enter an admin code.'),

    (req, res, next) => {
        // Get the validation result
        const errors = validationResult(req);
        // Check if there are any errors
        if (!errors.isEmpty()) {
            // If there are, render the join admins page with the errors
            res.render('admin_form', { title: 'Join Admins', errors: errors.array(), user: res.locals.currentUser });
            return;
        }

        else if (req.body.admincode != '123456') {
            // If there aren't, render the join admins page with an error
            res.render('admin_form', { title: 'Join Admins', error: 'Invalid admin code.', user: res.locals.currentUser });
            return;
        }
    
        const user = new User(res.locals.currentUser);
        user.admin = true;

        User.findOneAndUpdate({ _id: res.locals.currentUser._id }, user, { new: true }, (err, user) => {
            if (err) return next(err);
            // If there are no errors, redirect to the home page
            res.redirect('/');
        }
        );
    }
]


