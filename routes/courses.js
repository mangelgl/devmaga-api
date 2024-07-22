const express = require('express');
const router = express.Router({ mergeParams: true });

const Course = require('../models/Course');
const advancedResults = require('../middleware/advanced-results');

const {
	getCourses,
	getSingleCourse,
	getCoursesFromBootcamp,
	createCourse,
	updateCourse,
	deleteCourse,
} = require('../controller/courses');

router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamps',
			select: 'name description',
		}),
		getCourses
	)
	.post(createCourse);

router
	.route('/:id')
	.get(getSingleCourse)
	.put(updateCourse)
	.delete(deleteCourse);

router.route('/:bootcampId/courses').get(getCoursesFromBootcamp);

module.exports = router;
