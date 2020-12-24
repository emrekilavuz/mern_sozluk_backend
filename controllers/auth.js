const crypto = require('crypto');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');

// @route POST api/v1/auth/register
// @desc  Register user
// @access Public
exports.register = asyncHandler( async (req, res, next) => {
    const {nickname, email, password} = req.body;

    const user = await User.create({
        nickname,
        email, 
        password
    });

    console.log("user", user);

    sendTokenResponse(user, 200, res);
});


// @route GET api/v1/auth/login
// @desc  Login user
// @access Public
exports.login = asyncHandler( async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    if(user.isSilik){
        return res.json({success : false, error : "Bu hesap silinmiş"});
    }

    sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly : true
    };

    if(process.env.NODE_ENV === 'production'){
        options.secure  = true;
    }

    user.password = undefined;

    res.status(statusCode).cookie('token', token, options).json({success : true, token, user});
    };

// @desc Get user information
exports.getMe = asyncHandler( async (req,res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
         data : user
    })
});



// @desc Log user out/ Clear cookie
// @route GET /api/v1/auth/logout
// @access Private
exports.logout = asyncHandler( async (req,res, next) => {
    res.cookie('token', 'none', {
        expires : new Date(Date.now() + 10 * 1000),
        httpOnly : true
    });

    res.status(200).json({
        success : true,
         data : {}
    })
});

// @desc Update user passwors
// @route PUT /api/v1/auth/updatepassword
exports.updateUserPassword = asyncHandler( async (req,res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse(`Password is incorrect`, 401));
    }

    user.password = req.body.newPassword;
    await user.save();
    
    sendTokenResponse(user, 200, res);
});

// @desc Update user details
// @route PUT /api/v1/auth/updatedetails
// @access Private
exports.updateUserDetails = asyncHandler( async (req,res, next) => {
    const fieldsToUpdate = {
        nickname : req.body.nickname,
        email : req.body.email
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new : true,
        runValidators : true
    });

    res.status(200).json({
        success : true,
         data : user
    })
});




exports.forgotPassword = asyncHandler( async (req, res, next) => {
    const user = await User.findOne({ email : req.body.email});

    if(!user){
        return next(new ErrorResponse(`there is no user with that email`, 404));
    }

    const resetToken = user.getResetPasswordToken();

    console.log(resetToken);

    await user.save({validateBeforeSave : false});

    return res.status(200).json({success : true, data: user});
});

exports.resetPassword = asyncHandler( async(req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({resetPasswordToken, resetPasswordExpire : {$gt : Date.now()}});

    if(!user){
        return next(new ErrorResponse(`Invalid token`,400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);

});
