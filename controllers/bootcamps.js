const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async')

// @desc  GET all bootcamps
// @routes GET /api/v1/bootcamps
// access  public (doesn't need authentication)
exports.getBootcamps = asyncHandler(async (req, res, next) =>{
   
        const bootcamps = await Bootcamp.find(req.body);

        return res.status(200).json({
            success: true, 
            count: bootcamps.length,
            data: bootcamps
        });
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
   
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return  next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        return res.status(200).json({
            success: true,
            data: {}
        });
});