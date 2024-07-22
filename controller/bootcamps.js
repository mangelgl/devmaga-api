const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

/**
 * * @desc Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access public
 */
const getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
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

	if (!bootcamp) {
		return next(
			new ErrorResponse(404, `No bootcamp found with id ${req.params.id}`)
		);
	}

	res.status(200).json({ sucess: true, data: bootcamp });
});

/**
 * * @desc Delete a single bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access public
 */
const deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(404, `No bootcamp found with id ${req.params.id}`)
		);
	}

	// This will fire up the middleware to remove all courses binding to the bootcamp
	bootcamp.remove();

	res.status(200).json({ sucess: true, data: {} });
});

/**
 * * @desc Upload photo for bootcamp
 * @route PUT /api/v1/bootcamps/:id/photo
 * @access private
 */
const bootcampUploadPhoto = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(404, `No bootcamp found with id ${req.params.id}`)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(400, 'Please upload a file!'));
	}

	let file = req.files.file;

	// Validate file upload is an image
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(400, 'Please upload a valid image!'));
	}

	// Check filesize
	const maxFileSize = process.env.MAX_FILESIZE_UPLOAD;
	if (file.size > maxFileSize) {
		return next(
			new ErrorResponse(
				400,
				`Please upload an image less than ${Math.ceil(
					maxFileSize / 1024 ** 2
				)}MB!`
			)
		);
	}

	// Create custom filename
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(400, 'Problem with file upload'));
		}

		await Bootcamp.findByIdAndUpdate(req.params.id, {
			photo: file.name,
		});

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});

module.exports = {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampsByRadius,
	bootcampUploadPhoto,
};
