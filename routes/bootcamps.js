const express = require('express');
const router = express.Router();

const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius,
	bootcampUploadPhoto,
} = require('../controller/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advanceResults = require('../middleware/advanced-results');
const protect = require('../middleware/auth');

// Include other resources routes
const courseRouter = require('./courses');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

// We're not going to use anymore the '/api/v1/bootcamps' prefix
router
	.route('/')
	.get(advanceResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(protect, updateBootcamp)
	.delete(protect, deleteBootcamp);

router.route('/:id/photo').put(protect, bootcampUploadPhoto);

router.route('/radius/:zipcode/:distance/:unit?').get(getBootcampsByRadius);

// Export router object with routes
module.exports = router;
