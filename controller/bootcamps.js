const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

/**
 * * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access public
 */
const getBootcamps = asyncHandler(async (req, res, next) => {
	const reqQuery = { ...req.query };
	const excludedFields = ['select', 'sort', 'page', 'limit'];

	// Check for excluded fields in our query and removes it
	excludedFields.forEach((field) => delete reqQuery[field]); // delete operator removes key/value from an object

	// Quantity Filtering
	// Create query string and format it to match quantity filtering format
	let queryStr = JSON.stringify(reqQuery);
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// * Finding resource in database
	let query = Bootcamp.find(JSON.parse(queryStr)).populate({
		path: 'courses',
		select: 'title description weeks',
	});

	// Select specific fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// Sort fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	// * Exec the query
	const bootcamps = await query;

	// Pagination object to response
	const pagination = {};

	if (startIndex > 0) {
		pagination.previous = {
			page: page - 1,
			limit,
		};
	}

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		pagination,
		data: bootcamps,
	});
});

/**
 * * @desc Get a single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access public
 */
const getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	res.status(200).json(bootcamp);
});

/**
 * * @desc Get bootcamps within a radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance/:unit
 * @access public
 */
const getBootcampsByRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance, unit } = req.params;

	// Init location, latitude and longitude variables
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calculate radius using radians (miles by default)
	// Divide distance by radius of Earth
	// Earth Radius = 3,963 mi / 6,378 km
	const radius = distance / 3963;

	if (unit == 'km') {
		const radius = distance / 6378.1;
	}

	// Find bootcamps with radius filter (see README.md link section for more information)
	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: {
				$centerSphere: [[lng, lat], radius],
			},
		},
	});

	res.status(200).json({
		count: bootcamps.length,
		data: bootcamps,
	});
});

/**
 * * @desc Create a new bootcamp
 * @route POST /api/v1/bootcamps
 * @access public
 */
const createBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		sucess: true,
		data: bootcamp,
	});
});

/**
 * * @desc Update a single bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access public
 */
const updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true, // will return document after update was applied.
		runValidators: true, // will validate the body to check if is ok
	});

	res.status(200).json({ sucess: true, data: bootcamp });
});

/**
 * * @desc Delete a single bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access public
 */
const deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	// This will fire up the middleware to remove all courses binding to the bootcamp
	bootcamp.remove();

	res.status(200).json({ sucess: true });
});

module.exports = {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius,
};
