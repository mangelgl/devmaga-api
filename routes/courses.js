const express = require('express');
const router = express.Router({ mergeParams: true });

const {
	getCourses,
	getSingleCourse,
	getCoursesFromBootcamp,
	createCourse,
	updateCourse,
	deleteCourse,
} = require('../controller/courses');

router.route('/').get(getCourses).post(createCourse);

router
	.route('/:id')
	.get(getSingleCourse)
	.put(updateCourse)
	.delete(deleteCourse);

router.route('/:bootcampId/courses').get(getCoursesFromBootcamp);

module.exports = router;
