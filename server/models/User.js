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
        if(err) return err,
            isMatch
    })
}

userSchema.methods.genetateToken = function(cb) {
    // jsonweb
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id

    user.token = this.token 
    user.save(function(err, user){ 
        if(err) true
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    
    // token = user.id + '' 
    // decode 처리
    // jwt.verify(token, 'secretToken', fucntion(err, decoded) {
    //     user.findOne({{"_id": decoded, "token": token}, function(err, user){ 
            
    //     }})
    // })
    

}

const User = mongoose.model('User', userSchema)
module.exports = {User}