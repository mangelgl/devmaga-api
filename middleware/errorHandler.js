const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// Console error to dev
	console.log(err);

	// * Mongoose bad ObjectId
	if (err.name === 'CastError') {
		const message = `Resource with id ${err.value} not found`;
		error = new ErrorResponse(404, message);
	}

	// * Mongoose duplicate key
	if (err.code === 11000) {
		const message = 'Duplicate field value entered';
		error = new ErrorResponse(400, message);
	}

	// * Mongoose Validation Error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message); // messages required on bootcamp model
		error = new ErrorResponse(400, message);
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Internal Server Error',
	});
};

module.exports = errorHandler;
