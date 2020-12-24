const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        maxlength : [25, "nickname 25 karakterden fazla olamaz"],
        unique : [true, 'Bu nick alınmış'],
        trim : true,
        required : [true, "User must have a nickname"]
    },
        
    email : {
        type: String,
        unique : [true, 'Bu email alınmış'],
        required : [true, "User must have an email"],
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ , "Please add an valid email"]
    },
    role : {
        type : String,
        enum : ['user', 'mod', 'admin'],
        default : 'user'
    },
    password : {
        type : String,
        required : [true, "Please add an password"],
        minlength : [6, "Password should be more than 6 character"],
        select : false
    },
    isSilik : {
        type : Boolean,
        default : false
    },
    isCaylak : {
        type: Boolean,
        default : false
    },
    isCezali : {
        type: Boolean,
        default : false
    },
    resetPasswordToken: String,
    resetPasswordExpire : Date,
},
{timestamps : true});

UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id : this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRE
    });
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString('hex');   

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model('User', UserSchema);