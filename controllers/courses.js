const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async')
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
 

 // @desc  GET all Courses
// @routes GET /api/v1/Courses
// @routes GET /api/v1/bootcamps/:bootcampId/courses
// access  public (doesn't need authentication)
exports.getCourses = asyncHandler(async(req, res, next) => {

    if (req.params.bootcampId) {
        const courses = await Course.find({bootcamp: req.params.bootcampId});

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })

    } else {
        res.status(200).json(res.advanceResults);
    }
}); 

 // @desc  GET Single Course
// @routes GET /api/v1/courses/:id
// access  public (doesn't need authentication)

exports.getSingleCourse = asyncHandler(async(req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        pat: 'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`),404);
    }

    return res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
}); 

 // @desc  Add Course
// @routes POST /api/v1/courses/:id
// @routes GET /api/v1/bootcamps/:bootcampId/courses
// access  Private

exports.addCourse = asyncHandler(async(req, res, next) => {

    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp) {
        return next(new ErrorResponse(`No course with id of ${req.params.bootcampId}`),404);
    }

    // Make sure it is the bootcamp owner that adds a course
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401
            )
        );
    }

    const createCourse = await Course.create(req.body);

    return res.status(200).json({
        success: true,
        data: createCourse
    });
}); 

 // @desc  Update Course
// @routes PUT /api/v1/courses/:id
// access  Private

exports.updateCourse = asyncHandler(async(req, res, next) => {

    let course = await Course.findById(req.params.id);


    if(!course) {
        return next(new ErrorRsponse(`No course with id of ${req.params.id}`),404);
    }

    // Make sure it is the course owner who can update a course
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update a course to bootcamp ${course._id}`, 401
            )
        );
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    return res.status(200).json({
        success: true,
        data: createCourse
    });
}); 

 // @desc  Delete Course
// @routes Delete /api/v1/courses/:id
// @access  Private

exports.deleteCourse = asyncHandler(async(req, res, next) => {

    const course = await Course.findById(req.params.id);


    if(!course) {
        return next(new ErrorResponse(`No course with id of ${req.params.id}`),404);
    }

      // Make sure it is the course owner who can delete a course
      if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete a course to bootcamp ${course._id}`, 401
            )
        );
    }

   await course.remove()

    return res.status(200).json({
        success: true,
        data: {} 
    });
}); 

