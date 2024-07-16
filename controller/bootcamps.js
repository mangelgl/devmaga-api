const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

/**
 * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access public
 */
const getBootcamps = asyncHandler(async (req, res, next) => {
	let queryStr = JSON.stringify(req.query);
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	const bootcampQuery = Bootcamp.find(JSON.parse(queryStr));

	const bootcamps = await bootcampQuery;

	res
		.status(200)
		.json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @desc Get a single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access public
 */
const getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		throw new Error(`No bootcamp with the id of ${req.params.id}`);
	}

	res.status(200).json(bootcamp);
});

/**
 * @desc Get bootcamps within a radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance/:unit
 * @access public
 */
const getBootcampsByRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance, unit } = req.params;

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
 * @desc Create a new bootcamp
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
 * @desc Update a single bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access public
 */
const updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		throw new Error(`An error ocurred during the update process`);
	}

	res.status(200).json({ sucess: true, data: bootcamp });
});

/**
 * @desc Delete a single bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access public
 */
const deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

	if (!bootcamp) {
		throw new Error(`No bootcamp found with id ${req.params.id}`);
	}

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
