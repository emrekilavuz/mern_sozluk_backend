const Altinci = require('../models/Altincilar');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const advancedResults = require('../middleware/advancedResults');
// @desc Get all altincis
// @route GET /api/v1/altincilar
// @access Public
exports.getAltinciPaginated = asyncHandler( async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});


// @desc Get altinci by name
// @route GET /api/v1/altincilar/byName/something/:namee
// @access Public
exports.getAltinciByName = asyncHandler (async (req, res, next) => {
    //queryName = req.query.namee;
    queryName = req.params.namee;
    const altinci = await Altinci.findOne({name: queryName }).exec();
    if(!altinci) {
        return next(new ErrorResponse(`Kategori bulunamadı id: ${req.params.namee}`, 400));
    }
    res.status(200).json({success : true, data : altinci});
    
});


// @desc Get all altincis
// @route GET /api/v1/altincilar
// @access Public
exports.getAllAltincis = asyncHandler( async (req, res, next) => {

        const altincis = await Altinci.find({altalt : "genel"}).limit(25);
        res.status(200).json({success: true, count : altincis.length, data : altincis});
    });


// @desc Get one altinci
// @route GET /api/v1/altincilar:id
// @access Public
exports.getOneAltinci = asyncHandler(async (req, res, next) => {

        const altinci = await Altinci.findById(req.params.id);

        if(!altinci){
            return next(new ErrorResponse(`Kategori bulunamadı id: ${req.params.id}`, 400));
        }

        res.status(200).json({data : altinci});
    
});

// @desc Post one altinci
// @route POST /api/v1/altincilar
// @access Private 
exports.postOneAltinci = asyncHandler(async (req, res, next) => {
        if(req.body.owner !== req.user.id){
            return next(new ErrorResponse(`Sen yalancisin adi`), 403);
        }

        const one_altinci = await Altinci.findOne({owner : req.body.owner});

        if(req.user.role === 'user' && one_altinci){
            return next(new ErrorResponse(`User has already one kategori`, 403));
        }

        const altinci = await(Altinci.create(req.body)); 

        res.status(201).json({
            success : true, 
            data : altinci
        });
});


// @desc Update one altinci
// @route Update /api/v1/altincilar:id
// @access Private
exports.updateOneAltinci = asyncHandler(async (req, res, next) => {
    
        const hedef_kategori = await Altinci.findById(req.params.id);

        if(!hedef_kategori){
            return next(new ErrorResponse(`Kategori bulunamadı id: ${req.params.id}`, 400));
        }

        if(hedef_kategori.owner.toString() !== req.user.id && req.user.role === "user"){
            return next(new ErrorResponse(`Unauthorized ${req.user.id}`, 403));
        }
        const updated_altinci = await Altinci.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });
        res.status(200).json({data : updated_altinci, success: true});
    
});


// @desc Delete one altinci
// @route Delete /api/v1/altincilar:id
// @access Private
exports.deleteOneAltinci = asyncHandler(async (req, res, next) => {
        const hedef_kategori = await Altinci.findById(req.params.id);

        if(!hedef_kategori){
            return next(new ErrorResponse(`Kategori bulunamadı id: ${req.params.id}`, 400));
        }

        if(hedef_kategori.owner.toString() !== req.user.id && req.user.role === "user"){
            return next(new ErrorResponse(`Unauthorized ${req.user.id}`, 403));
        }

        hedef_kategori.remove();

        res.status(200).json({success : true ,data : {}});
   
});
