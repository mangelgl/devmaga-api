const dotenv = require('dotenv');
const config = require('../config/index');

// * HELPER: Get token from model, create cookie and send response
const sendTokenResponse = function (user, statusCode, res) {
	// Create token
	const token = user.getSignedJwtToken();

	// Cookie options
	const options = {
		expires: new Date(
			Date.now() + config.JWT.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
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

module.exports = sendTokenResponse;
