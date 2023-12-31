const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
	let error = {...err}

	error.message = error.message;

//log to the console for dev 
// console.log(err);
console.log(err.stack);

// Mongoose bad objectId
if (err.name === 'CastEror') {
	const message = `Resource not found`;
	error = new ErrorResponse(message, 404);
}

// Mongoose duplicate key
if (err.code === 11000) {
	const message = 'Duplicate field value entered';
	error = new ErrorResponse(message, 400);
}

// mongoose Validation error
if (err.name === 'ValidationError') {
	const message = Object.values(err.errors).map(val => val.message);
	error = new ErrorResponse(message, 400);
}


	res.status( error.statusCode || 500).json({
		success: false,
		error: error.message || 'server Error'
	});
};

module.exports = errorHandler;
