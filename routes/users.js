const express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const config = require('../config/database');
const jwt = require('jsonwebtoken');

router.post('/register', (req, res) => {
    console.log('[USER-ROUTE] Register user called!');
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({
                success: false,
                message: "Failed to register user"
            });
        } else {
            res.json({
                success: true,
                message: "User Registered"
            });
        }
    });
});

router.post('/authenticate', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({
                success: false,
                msg: "User not found"
            });
        }
        if (user) {
            User.comparePassword(password, user.password, (err, isMatch) => {
                if (err) {
                    throw err;
                }
                if (isMatch) {
                    const token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 100000
                    });
                    res.json({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                            id: user._id,
                            name: user.name,
                            username: user.username,
                            email: user.email
                        }
                    });
                }
                else{
                    return res.json({
                        success: false,
                        msg: 'Wrong Password!'
                    });
                }
            });
        }
    });
});

router.get('/profile', passport.authenticate('jwt',{session:false}), (req, res, next) => {
    console.log(req.get('Authorization'));
    res.json({
        user: req.user
    });
});

module.exports = router;