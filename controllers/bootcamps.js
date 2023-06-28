const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const ErrorRsponse = require('../utils/errorResponse')

// @desc  GET all bootcamps
// @routes GET /api/v1/bootcamps
// access  public (doesn't need authentication)
exports.getBootcamps = async (req, res, next) =>{
    try {
        const bootcamps = await Bootcamp.find(req.body);

        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                message: 'Bootcamp not available'
            });
        }
        return res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });
    } catch (error) {
        return res.status(400).json({
            success: false
        });
    }
}

// @desc get single bootcamp
// @routes GET /api/v1/bootcamps/:id
// access  public (need authentication i.e user need to be logged in)

exports.getBootcamp = async (req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        
        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                message: 'Bootcamp not available'
            });
        }

        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
        
    } catch (error) {

        next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
}

// @desc create bootcamp
// @routes Post /api/v1/bootcamps
// access  Private (need authentication i.e user need to be logged in)

exports.createBootcamp = async (req,res,next)=>{
    try {
 const bootcamp = await Bootcamp.create(req.body);

    return res.status(201).json({
    success: true,
    message: 'bootcamp created successfully',
    data: bootcamp
}); 
    } catch (error) {
        return res.status(400).json({
            success: false
        })
    }

};

// @desc update bootcamp
// @routes PUT /api/v1/bootcamps
// access  Private (need authentication i.e user need to be logged in)

exports.updateBootcamp = async (req,res,next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!bootcamp) {
            return res.status(400).json({
                success: false,
            });
        }

        return res.status(200).json({
            success: true,
            data: bootcamp,
            message: 'bootcamp updated successfully'
        });
    } catch (error) {
        return res.status(400).json({
            success: false
        })
    }
}

// @desc delete bootcamp
// @routes DELETE /api/v1/bootcamps
// access  Private (need authentication i.e user need to be logged in)
exports.deleteBootcamp = async (req, res, next) =>{
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        if (!bootcamp) {
            return res.status(400).json({
                success: false,
                message: 'no bootcamp deleted'
            });
        }

        return res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        return res.status(400).json({
            success: false
        });
    }
}