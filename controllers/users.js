const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/user');

// @desc  GET all users
// @routes POST /api/v1/auth/users
// access  Private(ADMIN)
exports.getUsers = asyncHandler (async (req, res, next) => {
   return  res.status(200).json(res.advancedResults)
  });

// @desc  GET Single user
// @routes POST /api/v1/auth/users/:id
// access  Private(ADMIN)
exports.getUser = asyncHandler (async (req, res, next) => {
   const user = await User.findById(req.params.id);

   res.status(200).json({
    success: true,
    data: user
   });
  });

// @desc  Create user
// @routes POST /api/v1/auth/users
// access  Private(ADMIN)
exports.createUser = asyncHandler (async (req, res, next) => {
   const user = await User.create(req.body);

   res.status(201).json({
    success: true,
    data: user
   });
  });

// @desc  Update user
// @routes PuT /api/v1/auth/users/:id
// access  Private(ADMIN)
exports.updateUser = asyncHandler (async (req, res, next) => {
   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
   });

   res.status(200).json({
    success: true,
    data: user
   });
  });

// @desc  Delete user
// @routes Delete /api/v1/auth/users/:id
// access  Private(ADMIN)
exports.deleteUser = asyncHandler (async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);

   res.status(200).json({
    success: true,
    data: {}
   });
  });