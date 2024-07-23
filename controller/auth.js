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

	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token });
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

	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token });
});

module.exports = {
	register,
	login,
};
