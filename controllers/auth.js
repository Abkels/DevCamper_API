const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');

// @desc  Register user
// @routes GET /api/v1/auth/register
// access  public (doesn't need authentication)
exports.register = asyncHandler (async (req, res, next) => {
  const {name, email, password, role} = req.body;
  
  //Create user
  const user = await User.create({
    name, 
    email, 
    password, 
    role});

    return res.status(200).json({success: true});
});
