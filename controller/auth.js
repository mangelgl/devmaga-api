const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

/**
 * * @desc Register user
 * @route POST /api/v1/auth/register
 * @access public
 */
const register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	sendTokenResponse(user, 200, res);
});

/**
 * * @desc Login user
 * @route POST /api/v1/auth/login
 * @access public
 */
const login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate email and password
	if (!email || !password) {
		return next(
			new ErrorResponse(400, 'Please provde an email and a password')
		);
	}

	// Check user if exists
	const user = await User.findOne({ email }).select('+password');

	if (!user) {
		return next(new ErrorResponse(401, 'Invalid credentials'));
	}

	// Check if passwords matches
	const isMatch = await user.matchPasswords(password);

	if (!isMatch) {
		return next(new ErrorResponse(401, 'Invalid credentials'));
	}

	sendTokenResponse(user, 200, res);
});

// * Get token from model, create cookie and send response
const sendTokenResponse = function (user, statusCode, res) {
	// Create token
	const token = user.getSignedJwtToken();

	// Cookie options
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
		),
		httpOnly: true, // can not be read from client side scripts
	};

	// https
	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}

	// send response
	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
	});
};

/**
 * * @desc Get current logged in user
 * @route POST /api/v1/auth/me
 * @access Private
 */
const getUserLoggedIn = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

module.exports = {
	register,
	login,
	getUserLoggedIn,
};
