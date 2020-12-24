const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc Get all users advanced
// @route GET /api/v1/auth/users
// @access Private/Admin
exports.getAllUsers = asyncHandler( async (req, res, next ) => {
    res.status(200).json(res.advancedResults);
});


// @desc Get a single user
// @route GET /api/v1/auth/users/:id
// @access Private/Admin
exports.getAUser = asyncHandler( async (req, res, next ) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorResponse(`Not found`,404));                        
    }
    res.status(200).json({
        success : true,
        data : user
    });
});


// @desc Create a user
// @route POST /api/v1/auth/users/
// @access Private/Admin
exports.createAUser = asyncHandler( async (req, res, next ) => {
    const user = await User.create(req.body);
    if(!user){
        return next(new ErrorResponse(`User can not be created`, 400));
    }
    res.status(201).json({
        success : true,
        data : user
    });
});


// @desc Update a user
// @route PUT /api/v1/auth/users/:id
// @access Private/Admin
exports.updateAUser = asyncHandler( async (req, res, next ) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });
    if(!user){
        return next(new ErrorResponse(`User can not be updated`, 400));
    }
    res.status(200).json({
        success : true,
        data : user
    });
});



// @desc Delete a user
// @route DELETE /api/v1/auth/users/:id
// @access Private/Admin
exports.deleteAUser = asyncHandler( async (req, res, next ) => {
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success : true,
        data : {} 
    });
});