const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
	register,
	login,
	logout,
	getUserLoggedIn,
	forgotPassword,
	resetPassword,
	updateUserDetails,
	updatePassword,
} = require('../controller/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/me').get(protect, getUserLoggedIn);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:token').put(resetPassword);
router.route('/userdetails').put(protect, updateUserDetails);
router.route('/updatepassword').put(protect, updatePassword);

module.exports = router;
