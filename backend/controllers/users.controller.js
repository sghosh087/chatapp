const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const { validationResult } = require('express-validator');

exports.registration = (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors occured',errors: errors.array() });
    }

    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const pass = req.body.password;

    User.findOne({email: email}).then(
        userData => {
            if(!userData) {
                let password = bcrypt.hashSync(pass, 12);
                const user = new User({
                    firstName,
                    lastName,
                    email,
                    password
                });
                return user.save()
            }
            return res.status(400).json({message: 'Email already exists', success: false});
        }
    ).then(
        isSaved => {
            res.status(201).json({message: 'User registered successfully', success: true});
        }
    ).catch(err => {
        if(!err.status) {
            err.status = 500;
        }
        throw new Error(err);
    })
}

exports.login = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation errors occured',errors: errors.array() });
    }

    const email = req.body.email;
    const password = req.body.password;
    try {
    const user = await User.findOne({ email: email });
    if(user) {
        const isMatched = await bcrypt.compare(password, user.password);
        if(isMatched) {
            const secret = process.env.SECRET || 'secretkey';
            const token = jwt.sign({ ...user },secret);
            const userData = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                id: user._id,
                expiresIn: 3600,
                token: token
            }
            return res.status(200).send({message: 'Login successful', userData, success: true});
        }
    }
        res.status(401).send({message: 'Username / password is incorrect', success: false})
    } catch(err) {
        if(!err.status) err.status = 500;
        next(new Error(err));
    }
}
