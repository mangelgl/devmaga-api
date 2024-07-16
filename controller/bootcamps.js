const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access public
 */
const getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();

		res
			.status(200)
			.json({ success: true, count: bootcamps.length, data: bootcamps });
	} catch (error) {
		next(error);
	}
};

/**
 * @desc Get a single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access public
 */
const getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			throw new Error(`No bootcamp with the id of ${req.params.id}`);
		}

		res.status(200).json(bootcamp);
	} catch (error) {
		next(error);
	}
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
		next(error);
	}
};

/**
 * @desc Update a single bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access public
 */
const updateBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!bootcamp) {
			throw new Error(`An error ocurred during the update process`);
		}

		res.status(200).json({ sucess: true, data: bootcamp });
	} catch (error) {
		next(error);
	}
};

/**
 * @desc Delete a single bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access public
 */
const deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

		if (!bootcamp) {
			throw new Error(`No bootcamp found with id ${req.params.id}`);
		}

		res.status(200).json({ sucess: true });
	} catch (error) {
		next(error);
	}
};

module.exports = {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
};
