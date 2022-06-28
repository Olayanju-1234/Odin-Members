var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var homeController = require('../controllers/homeController');
var message_controller = require('../controllers/messageController');
var userController = require('../controllers/userController');
var authController = require('../controllers/authController')

// Index/Homepage
router.get('/', homeController.index);

// Sign Up
router.get('/signup', authController.signupGet)

router.post('/signup', authController.signupPost)

// Log IN
router.get('/login', authController.loginGet)

router.post('/login', authController.loginPost)

// Log Out
router.get('/logout', authController.logoutGet)

// Create Message
router.get('/createMessage', message_controller.createMessageGet);

router.post('/createMessage', message_controller.createMessagePost);


// Delete Message
router.get('/deleteMessage', message_controller.deleteMessageGet);

router.post('/deleteMessage', message_controller.deleteMessagePost);

// Become an admin
router.get('/admin', userController.adminsGet);

router.post('/admin', userController.adminsPost);

// Become a member
router.get('/member', userController.membersGet);

router.post('/member', userController.membersPost);

module.exports = router;