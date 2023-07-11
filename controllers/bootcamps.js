const path = require('path')
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async')
const geocoder = require('../utils/geocoder')

// @desc  GET all bootcamps
// @routes GET /api/v1/bootcamps
// access  public (doesn't need authentication)
exports.getBootcamps = asyncHandler(async (req, res, next) =>{

        return res.status(200).json(res.advancedResults);
});

// @desc get single bootcamp
// @routes GET /api/v1/bootcamps/:id
// access  public (need authentication i.e user need to be logged in)

exports.getBootcamp = asyncHandler(async (req,res,next)=>{
    
        const bootcamp = await Bootcamp.findById(req.params.id);
        
        if (!bootcamp) {
           return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        return res.status(200).jsn({
            success: true,
            data: bootcamp
        });
   
});

// @desc create bootcamp
// @routes Post /api/v1/bootcamps
// access  Private (need authentication i.e user need to be logged in)

exports.createBootcamp = asyncHandler(async (req,res,next)=>{
// Add user to req.body
req.body.user = req.user.id;

// Check for published bootcamp
const publishedBootcamp = await Bootcamp.findOne({user: req.user.id});

// If the user is not an admin, they can only add one bootcamp
if (publishedBootcamp && req.user.role !== 'admin') {
    return next(new ErrorResponse(`the user with ID ${req.user.id} has already published a bootcamp`, 400));
}

 const bootcamp = await Bootcamp.create(req.body);

    return res.status(201).json({
    success: true,
    message: 'bootcamp created successfully',
    data: bootcamp
}); 
    

});

// @desc update bootcamp
// @routes PUT /api/v1/bootcamps
// access  Private (need authentication i.e user need to be logged in)

exports.updateBootcamp = asyncHandler(async (req,res,next) => {
    
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        return res.status(200).json({
            success: true,
            data: bootcamp,
            message: 'bootcamp updated successfully'
        });
});

// @desc delete bootcamp
// @routes DELETE /api/v1/bootcamps
// access  Private (need authentication i.e user need to be logged in)
exports.deleteBootcamp = asyncHandler(async (req, res, next) =>{
   
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        bootcamp.remove() // will trigger the middleware in bootcamp controll under cascading delete...

        return res.status(200).json({
            success: true,
            data: {}
        });
});


// @desc Get bootcamps with a radius
// @routes GET /api/v1/bootcamps/radius/:zipcode/:distance
// access  Private (need authentication i.e user need to be logged in)
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) =>{
    const {zipcode, distance} = req.params;

    // Get latitude and longitude from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;


    // Calc radius of the earth using radians
    // Divid distance by radius of the earth
    // earth radius = 3,963 miles/ 6,378km

    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});

// @desc Upload photo for bootcamp
// @routes PUT /api/v1/bootcamps/:id/photo
// access  Private (need authentication i.e user need to be logged in)
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) =>{
   
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    if(!req.files) {
        return next(
            new ErrorResponse( `please upload a file`, 400)
        );
    }
    // console.log(req.files.file);
    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startWith('image')) {
        return next(
            new ErrorResponse( `please upload an image file`, 400)
        );
    }

    // Check file size 
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse( `please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        );
    }

    // Create custom filename so that when an image is uploaded with same name it doesn't overide.
     file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`; //have to import path so we can get the ext of the image

     file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err);
            return next(
                new ErrorResponse( `Problem with file upload`, 500)
            );
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        res.status(200).json({
            success: true
        })
     })
     console.log(filename);
});
