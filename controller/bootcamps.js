const e = require('express');
const Bootcamp = require('../models/Bootcamp');

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access public
 */
const getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();

		res.status(200).json(bootcamps);
	} catch (error) {
		res.status(400).json({
			sucess: false,
		});
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
		res.status(400).json({
			sucess: false,
			error: error.message,
		});
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
		res.status(400).json({
			sucess: false,
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
