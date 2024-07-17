const express = require('express');
const router = express.Router();

const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius,
} = require('../controller/bootcamps');

// Include other resources routes
const courseRouter = require('./courses');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

// We're not going to use anymore the '/api/v1/bootcamps' prefix
router.route('/').get(getBootcamps).post(createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

router.route('/radius/:zipcode/:distance/:unit?').get(getBootcampsByRadius);

// Export router object with routes
module.exports = router;
