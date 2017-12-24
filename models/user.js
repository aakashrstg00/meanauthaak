const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
    var query = {
        username: username
    };
    User.findOne(query, callback);
}

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            throw err;
        } else {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    throw err;
                } else {
                    newUser.password = hash;
                    newUser.save(callback);
                }
            });
        }
    });
}

module.exports.comparePassword = (cPassword,hash,callback)=>{
    bcrypt.compare(cPassword,hash,(err,isMatch)=>{
        if(err){
            throw err;
        }else{
            callback(null,isMatch);
        }
    });
}