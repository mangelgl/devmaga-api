const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');

/**
 * * @desc Get all courses
 * @route GET /api/v1/courses
 * @access public
 */
const getCourses = asyncHandler(async (req, res, next) => {
	// * Finding resource in database
	const query = Course.find().populate({
		path: 'bootcamp',
		select: 'name description',
	});

	// * Exec the query
	const courses = await query;

	res.status(200).json({
		success: true,
		count: courses.length,
		data: courses,
	});
});

/**
 * * @desc Get a single course
 * @route GET /api/v1/courses/:id
 * @access public
 */
const getSingleCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	res.status(200).json(course);
});

/**
 * * @desc Get courses from a bootcamp
 * @route GET /api/v1/bootcamps/:bootcampId/courses
 * @access public
 */
const getCoursesFromBootcamp = asyncHandler(async (req, res, next) => {
	const courses = await Course.find({ bootcamp: req.params.bootcampId });

	res.status(200).json({
		count: courses.length,
		data: courses,
	});
});

module.exports = {
	getCourses,
	getSingleCourse,
	getCoursesFromBootcamp,
};
