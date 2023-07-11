const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken'); // jsonwebtoken

//ab
const userSchema = mongoose.Schema({//
    name: {
        type : String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 50
    }, 
    role: {
        type: Number,
        defalt: 0 
    },
    image: String, 
    token: {
        type: String 
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {//11
    var user = this;
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            
            bcrypt.hash(user.password,  salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash
                next()
            })
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err),
        cb(null, isMatch)
    })
}

userSchema.methods.genetateToken = function(cb) {
    // jsonweb
    var user = this;
    var token = jwt.sign(user._id, 'secretToken')
    
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = this.token 
    user.save(function(err, user){ 
        if(err) true
    })

}

const User = mongoose.model('User', userSchema)
module.exports = {User}