const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	getCourses,
	getSingleCourse,
	getCoursesFromBootcamp,
} = require('../controller/courses');

router.route('/').get(getCourses);

router.route('/:id').get(getSingleCourse);

router.route('/:bootcampId/courses').get(getCoursesFromBootcamp);

module.exports = router;
