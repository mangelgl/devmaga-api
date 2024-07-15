const Bootcamp = require('../models/Bootcamp');

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access public
 */
const getBootcamps = (req, res, next) => {
	res.status(200).json({ data: 'Show all bootcamps' });
};

/**
 * @desc Get a single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access public
 */
const getBootcamp = (req, res, next) => {
	res.status(200).json({ data: `Show bootcamp ${req.params.id}` });
};

/**
 * @desc Create a new bootcamp
 * @route POST /api/v1/bootcamps
 * @access public
 */
const createBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({
			sucess: true,
			data: bootcamp,
		});
	} catch (error) {
		res.status(400).json({
			sucess: false,
			error: error.message,
		});
	}
};

/**
 * @desc Update a single bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access public
 */
const updateBootcamp = (req, res, next) => {
	res.status(200).json({ data: `Update bootcamp ${req.params.id}` });
};

/**
 * @desc Delete a single bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access public
 */
const deleteBootcamp = (req, res, next) => {
	res.status(200).json({ data: `Delete bootcamp ${req.params.id}` });
};

module.exports = {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
};
