const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

/**
 * * @desc Get all reviews
 * GET /api/v1/reviews
 * @access Public
 */
const getReviews = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

/**
 * * @desc Get single review
 * GET /api/v1/reviews/:id
 * @access Public
 */
const getReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(404, `Review not found with id ${req.params.id}`)
		);
	}

	res.status(200).json({
		success: true,
		data: review,
	});
});

/**
 * * @desc Get single review from bootcamp id
 * GET /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
const getReviewFromBootcamp = asyncHandler(async (req, res, next) => {
	const { bootcampId } = req.params;

	console.log(bootcampId);
	console.log(req.params);

	const bootcamp = await Bootcamp.findById({ bootcampId });

	if (!bootcamp) {
		return next(
			new ErrorResponse(404, `Bootcamp ${bootcampId} does not exists`)
		);
	}

	const reviews = await Review.find({ bootcamp: bootcampId }).populate({
		path: 'Bootcamp',
		select: 'name description',
	});

	res.status(200).json({
		success: true,
		data: reviews,
	});
});

/**
 * * @desc Add review
 * POST /api/v1/bootcamps/:bootcampId/reviews
 * @access Public
 */
const addReview = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;
	req.body.user = req.user.id;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new ErrorResponse(404, `No bootcamp with id ${req.params.bootcampId}`)
		);
	}

	const review = await Review.create(req.body);

	res.status(201).json({
		success: true,
		data: review,
	});
});

/**
 * * @desc Updates a single review
 * @route PUT /api/v1/reviews/:id
 * @access public
 */
const updateReview = asyncHandler(async (req, res, next) => {
	let review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(404, `No review found with id ${req.params.id}`)
		);
	}

	// Make sure user is review owner
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				401,
				`User ${req.user.id} is not authorize to update this review`
			)
		);
	}

	review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		sucess: true,
		data: review,
	});
});

/**
 * * @desc Deletes a single review
 * @route DELETE /api/v1/reviews/:id
 * @access public
 */
const deleteReview = asyncHandler(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		return next(
			new ErrorResponse(404, `No review found with id ${req.params.id}`)
		);
	}

	// Make sure user is review owner
	if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
		return next(
			new ErrorResponse(
				401,
				`User ${req.user.name} is not authorize to delete this review`
			)
		);
	}

	review.remove();

	res.status(200).json({
		sucess: true,
		data: {},
	});
});

module.exports = {
	getReviews,
	getReview,
	getReviewFromBootcamp,
	addReview,
	updateReview,
	deleteReview,
};
