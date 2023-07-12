const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc  Register user
// @routes POST /api/v1/auth/register
// access  public (doesn't need authentication)
exports.register = asyncHandler (async (req, res, next) => {
  const {name, email, password, role} = req.body;
  
  //Create user
  const user = await User.create({
    name, 
    email, 
    password, 
    role});
    sendTokenresponse(user, 200, res);
});

// @desc  Login user
// @routes POST /api/v1/auth/login
// access  public (doesn't need authentication)
exports.login = asyncHandler (async (req, res, next) => {
  const {email, password} = req.body;

//  Validate email & password
if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
}

// Check for user
const user = await User.findOne({email}).select('+password');

if(!user) {
    return next(new ErrorResponse('Invalid email or password', 401));
}

// Check if password matches
const isMatch = await user.matchPassword(password);
if(!isMatch) {
    return next(new ErrorResponse('Invalid email or password', 401));
} 

sendTokenresponse(user, 200, res); 
});


// @desc  Get current Logged in user
// @routes POST /api/v1/auth/me
// access  private

exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});



// @desc  Update user details (name, email)
// @routes PUT /api/v1/auth/updatedetails
// access  private

exports.updateDetails= asyncHandler(async(req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc  Update Password
// @routes PUT /api/v1/auth/updatepassword
// access  private

exports.updatePassword = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id).select('password');

    // Check current password
    if(!(await user.matchPassword(req.body.currentPassword))) {
        return next (new ErrorResponse('Password is incorrect', 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenresponse(user, 200, res);
});


// @desc  Forgot password
// @routes POST /api/v1/auth/me
// access  Public

exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.finOne({email: req.body.email});

    if (!user) {
        return next(new ErrorResponse('There is no user with that email', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    // console.log(resetToken)

    // user.resetPasswordToken = resetToken;
    // user.resetPasswordExpire = Date.now() + 3600000; // 1 hour

    await user.save({validateBeforeSave:false });

    // create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpasssword/${resetToken}`;

    const message = `You are recieving this email because you hav requested to reset your password. Please click the link below \n\n ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message
        });
        return res.status(200).json({
            success: true,
            data: 'Email sent successfully',
        });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false});

        return next(new ErrorResponse('Email could not be sent', 500));
    }

});


// @desc  Reset Password
// @routes POST /api/v1/auth/resetpassword/:resettoken
// access  Public

exports.resetPassword = asyncHandler(async(req, res, next) => {

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    });

    if(!user) {
        return next(new ErrorResponse('Invalid token', 400));
    }

    // set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined; 
    await user.save();

    sendTokenresponse (user, 200, res)
});



// Get token from model, create cookie and send response
const sendTokenresponse = (user, statusCode, res) => {
    // Create token
 const token = user.getSignedJwtToken();

 const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 *60 * 60 * 1000),
    httpOnly: true
 };

 if(process.env.NODE_ENV === 'production') {
    options.secure = true; 
 }

 res
 .status(statusCode)
 .cookie('token', token, options)
 .json({
    sucess: true,
    token
 });
}
