const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const config = require('../config/index');

const protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		// Set token from HTTP Headers
		token = req.headers.authorization.split(' ')[1];
		// Set token from cookies
	}
	// else if (req.cookies.token) {
	// 	token = req.cookies.token;
	// }

	// Authorization is not set
	if (!token) {
		return next(new ErrorResponse(401, 'Unauthorized to access this route'));
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, config.JWT.JWT_SECRET);

		req.user = await User.findById(decoded.id);

		next();
	} catch (error) {
		return next(new ErrorResponse(401, 'Unauthorized to access this route'));
	}
});

const authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(
				new ErrorResponse(
					401,
					`User role '${req.user.role}' is unauthorized to access this route`
				)
			);
		}
		next();
	};
};

module.exports = {
	protect,
	authorize,
};
