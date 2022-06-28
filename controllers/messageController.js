var Message = require('../models/messageModel');
const { body, validationResult } = require('express-validator');


// Create a new message GET
exports.createMessageGet = (req, res, next) => {
    // Check if the user is logged in
    if (res.locals.currentUser) {
        // If they are, render the create message page
        res.render('create_message', { title: 'Create Message', user: res.locals.currentUser.name });
    }
    else {
        // If they aren't, redirect them to the login page
        res.redirect('/login');
    }
}

// Create a new message POST
exports.createMessagePost = [
    // Validate and sanitize fields
    body('title', 'Title must be at least 5 characters long').isLength({ min: 5 }).escape(),
    body('content', 'Content must be at least 5 characters long').isLength({ min: 5 }).escape(),

    (req, res, next) => {
        // Get the validation result
        const errors = validationResult(req);
        // Check if there are any errors
        if (!errors.isEmpty()) {
            // If there are, render the create message page with the errors
            res.render('create_message', { title: 'Create Message', errors: errors.array(), user: res.locals.currentUser.name  });
        }
        else {
            // If there aren't, create the message
            const message = new Message({
                title: req.body.title,
                content: req.body.content,
                user: req.user._id,
                timestamp: Date.now()
            }).save((err) => {
                if (err) return next(err);  
                // If there are no errors, redirect to the message page
                res.redirect('/');
            }
            );
        }
    }
    
]


// Delete a message GET
exports.deleteMessageGet = (req, res, next) => {
    // Check if the user is logged in
    if (res.locals.currentUser && res.locals.currentUser.admin == true) {
        // If they are, render the delete message page
        res.render('delete_message', { title: 'Delete Message', user: res.locals.currentUser.name  });
        return;
    }
    else {
        // If they aren't, redirect them to the login page
        res.redirect('/admin');
    }
}

// Delete a message POST
exports.deleteMessagePost = (req, res, next) => {
    // Check if the user is logged in
    if (res.locals.currentUser.admin == true) {
        // If they are, delete the message
        Message.findByIdAndRemove(req.body.messageId, (err) => {
            if (err) return next(err);
            // If there are no errors, redirect to the message page
            res.redirect('/');
        }
        );
    }
    else {
        // If they aren't, redirect them to the login page
        res.redirect('/login');
    }
}

