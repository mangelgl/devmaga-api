const express = require('express');
const router = express.Router({ mergeParams: true });

const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const {
	getReviews,
	getReview,
	getReviewFromBootcamp,
	addReview,
	updateReview,
	deleteReview,
} = require('../controller/reviews');

router.route('/').get(
	advancedResults(Review, {
		path: 'bootcamp',
		select: 'name description',
	}),
	getReviews
);

router
	.route('/:id')
	.get(getReview)
	.put(protect, authorize('user', 'admin'), updateReview)
	.delete(protect, authorize('user', 'admin'), deleteReview);

router
	.route('/:bootcampId/reviews')
	.get(getReviewFromBootcamp)
	.post(protect, authorize('user', 'admin'), addReview);

module.exports = router;
