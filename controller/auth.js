const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendMail = require('../utils/sendMail');
const sendTokenResponse = require('../utils/sendTokenResponse');
const crypto = require('crypto');
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

/**
 * * @desc Log user out / clear cookies
 * @route GET /api/v1/auth/logout
 * @access Private
 * Does not works if auth.js middleware 18:20 is commented
 */
const logout = asyncHandler(async (req, res, next) => {
	res.cookie('token', 'none', {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: {},
	});
});

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

/**
 * * @desc Forgot password
 * @route POST /api/v1/auth/forgotpassword
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return next(new ErrorResponse(404, 'There is no user with that email'));
	}

	// Get reset token
	const resetToken = user.getResetPasswordToken();

	await user.save({ validateBeforeSave: false });

	// Create reset url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/resetpassword/${resetToken}`;

	const mailOptions = {
		email: req.body.email,
		subject: 'Password reset',
		message: `You are receiving this email because you (or someone else) has requested the reset of your password. Please make a PUT request to: \n\n ${resetUrl}`,
	};

	try {
		await sendMail(mailOptions);

		res.status(200).json({
			success: true,
			data: 'Email sent',
		});
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;

		await user.save({ validateBeforeSave: false });

		return next(new ErrorResponse(500, 'Email could not be sent'));
	}
});

/**
 * * @desc Reset password
 * @route PUT /api/v1/auth/resetpassword/:token
 * @access Private
 */
const resetPassword = asyncHandler(async (req, res, next) => {
	const token = crypto
		.createHash('sha256')
		.update(req.params.token)
		.digest('hex');

	const { password } = req.body;

	const user = await User.findOne({
		resetPasswordToken: token,
		resetPasswordExpire: { $gt: Date.now() },
	});

	if (!user) {
		return next(new ErrorResponse(400, 'Invalid token'));
	}

	user.password = password;
	user.resetPasswordToken = undefined;
	user.resetPasswordExpire = undefined;
	await user.save();

	sendTokenResponse(user, 200, res);
});

/**
 * * @desc Update user details
 * @route PUT /api/v1/auth/userdetails
 * @access Private
 */
const updateUserDetails = asyncHandler(async (req, res, next) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email,
	};

	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

/**
 * * @desc Update password
 * @route POST /api/v1/auth/updatepassword
 * @access Private
 */
const updatePassword = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id).select('+password');

	// Check current password
	if (!(await user.matchPasswords(req.body.currentPassword))) {
		return next(new ErrorResponse(401, 'Password incorrect!'));
	}

	user.password = req.body.newPassword;
	await user.save();

	sendTokenResponse(user, 200, res);
});

module.exports = {
	register,
	login,
	logout,
	getUserLoggedIn,
	forgotPassword,
	resetPassword,
	updateUserDetails,
	updatePassword,
};
