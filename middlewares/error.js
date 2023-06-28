const errorHandler = (err, req, res, next) => {
//log to the console for dev 
console.log(err.stack);

	res.status( err.statusCode || 500).json({
		success: false,
		error: err.message
	});
};

module.exports = errorHandler;
