const path = require('path');
const Baslik = require('../models/Baslik');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const moment = require('moment');

exports.createABaslik = asyncHandler ( async (req, res, next) => {
    const {name, altinci } = req.body;

    let year = moment().year();
    year = year * 1.3;
    const day_of_year = moment().dayOfYear();

    let trendingPoint = year + day_of_year;

    trendingPoint = Math.round(trendingPoint);

    const baslik = await Baslik.create({name, altinci, trendingPoint});

    if(!baslik){
        return next(new ErrorResponse(`Başlık oluşturulamadı`, 500));
    }

    return res.status(200).json({success : true, data: baslik});
});


exports.getAdvanced = asyncHandler( async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


// @desc Get all basliklar
// @route GET /api/v1/basliklar
// @access Public
exports.getAllBasliks = asyncHandler( async (req, res, next) => {

    const  basliklar = await Baslik.find();
    res.status(200).json({success: true, count : basliklar.length, data : basliklar});
});


// @route PUT api/v1/baslik/:id/photo
// @desc 
// @access Public
exports.uploadImageForBaslik = asyncHandler (async (req, res, next) => {
    const baslik = await Baslik.findById(req.params.id);

    if(!baslik){
        return next(new ErrorResponse(`Başlık bulunamadı`, 404));
    }

    if(baslik.photo !== "no-photo.jpg"){
        return next(new ErrorResponse(`${baslik.photo}`, 404)); 
    }

    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`,400));
    }

    console.log(req.files);

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`File type should be image`, 400));
    }

    if(file.size > process.env.MAX_FILE_SIZE){
        return next(new ErrorResponse(`please upload image less than 2 MegaByte`));
    }

    file.name = `photo_${baslik._id}${path.parse(file.name).ext}`;  

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Baslik.findByIdAndUpdate(req.params.id, {photo : file.name});

        res.status(200).json({
            success : true,
            data : file.name
        })
    })
});