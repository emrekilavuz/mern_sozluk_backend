const Entry = require('../models/Entry');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');


exports.getAdvanced = asyncHandler( async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});



// @desc Get entries by baslik
// @route GET /api/v1/entryler/:baslikId
// @access Public
exports.getEntriesByBaslik = asyncHandler( async (req, res, next) => {
    const baslikId = req.params.baslikId;
    const entryler = await Entry.find({baslik : baslikId});
    res.status(200).json({success: true, count : entryler.length, data : entryler});
});


exports.getEntryById = asyncHandler( async (req, res, next) => {
    const entryId = req.params.id;
    const entry = await Entry.findById(entryId);
    if(!entry){
        return next(new ErrorResponse(`Entry bulunamadı`, 404));
    }
    res.status(200).json({success: true, data : entry});
});


exports.deleteEntryAndYorums = asyncHandler( async (req, res, next) => {
    const entry = await Entry.findById(req.params.id);

    if(!entry){
        return next(new ErrorResponse(`Entry not found with id of ${req.params.id}`,404));
    }

    if(entry.ownerId.toString() !== req.user.id && req.user.role === "user"){
        return next(new ErrorResponse(`Not authorized ${req.user.id}`,403));
    }

    entry.remove();

    res.status(200).json({success : true, data : {}});
});


exports.createAnEntry = asyncHandler( async (req, res, next) => {
    const {
        baslik,
        ownerId,
        icerik
    } = req.body;

    if(req.user.id !== ownerId){
        return next(new ErrorResponse(`Not authorized ${req.user.id}  ${ownerId}`, 403));
    }

    const entry = await Entry.create({baslik, ownerId, icerik});

    return res.status(200).json({success : true, data: entry});
});

exports.updateAnEntry = asyncHandler(async (req, res, next) => {
    const hedefEntry = Entry.findById(req.params.id);

    if(!hedefEntry){
        return next(new ErrorResponse(`Entry not found with id of ${req.params.id}`,404));
    }

    if(hedefEntry.ownerId.toString() !== req.user.id && req.user.role === "user"){
        return next(new ErrorResponse(`Not authorized ${req.user.id}`,403));
    }

    const updated_entry = await Entry.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });
    res.status(200).json({data : updated_entry, success: true});

});

exports.likeAnEntry = asyncHandler(async (req, res, next) => {
    const hedefEntry = await Entry.findById(req.params.id);

    if(!hedefEntry){
        return next(new ErrorResponse(`Entry not found with id of ${req.params.id}`,404));
    }

    let like_count = hedefEntry.likeCount;
    like_count += 1

    const updated_entry = await Entry.findByIdAndUpdate(req.params.id, {likeCount : like_count}, {
        new :true,
        runValidators : true
    });

    res.status(200).json({data : updated_entry, success: true});
});

// @route PUT api/v1/entryler/:id/photo
// @desc 
// @access Public
exports.uploadImageForEntry = asyncHandler (async (req, res, next) => {
    const entry = await Entry.findById(req.params.id);
    let sayi = req.query.sayi;
    sayi = Number(sayi);
    console.log(sayi);
    if(!sayi || sayi > 4 || sayi < 1){
        return next(new ErrorResponse(`Çok fazla dosya`, 404));
    }

    if(!entry){
        return next(new ErrorResponse(`Entry bulunamadı`, 404));
    }

    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`,400));
    }

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`File type should be image`, 400));
    }

    if(file.size > process.env.MAX_FILE_SIZE){
        return next(new ErrorResponse(`please upload image less than 2 MegaByte`));
    }

    file.name = `photo_${entry._id}_${sayi}${path.parse(file.name).ext}`;  

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        if(sayi === 1){
            await Entry.findByIdAndUpdate(req.params.id, {photo1: file.name});
        }
        else if(sayi === 2){
            await Entry.findByIdAndUpdate(req.params.id, {photo2: file.name});
        }
        else if(sayi === 3){
            await Entry.findByIdAndUpdate(req.params.id, {photo3: file.name});
        }
        else if(sayi === 4){
            await Entry.findByIdAndUpdate(req.params.id, {photo4: file.name});
        }
        

        res.status(200).json({
            success : true,
            data : file.name
        })
    })
});