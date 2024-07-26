const advancedResults = (model, populate) => async (req, res, next) => {
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
	let query = model.find(JSON.parse(queryStr));

	// * Select specific fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// * Sort fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt');
	}

	// * Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	// * Exec the query
	const result = await query;

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

	res.advancedResults = {
		sucess: true,
		count: result.length,
		pagination,
		data: result,
	};

	next();
};

module.exports = advancedResults;
