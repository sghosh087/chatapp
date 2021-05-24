const express = require('express');
const router = express.Router();

const User = require('../models/User');
const userController = require('../controllers/users.controller');

const { body } = require('express-validator');

// User registration
router.post('/register', body('firstName').notEmpty().withMessage('First name is required'),
body('lastName').notEmpty().withMessage('Last name is required'),
body('email').isEmail().withMessage('Please enter a valid email').custom(value => {
    return User.findOne({email: value}).then(user => {
      if (user) {
        return Promise.reject('Email already in use');
      }
    })
}),
body('password').isLength({ min: 6 }).withMessage('Password must be minum 6 characters long'), userController.registration);

// User login
router.post('/login', body('email').isEmail().withMessage('Please enter a valid email'),
body('password').isLength({ min: 6 }).withMessage('Password must be minimum 6 characters long'), userController.login);

module.exports = router;
