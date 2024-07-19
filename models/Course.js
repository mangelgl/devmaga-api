const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add a course title'],
	},
	description: {
		type: String,
		required: [true, 'Please add a description'],
	},
	weeks: {
		type: Number,
		required: [true, 'Please add number of weeks'],
	},
	tuition: {
		type: Number,
		required: [true, 'Please add a tuition cost'],
	},
	minimumSkill: {
		type: String,
		required: [true, 'Please add a minimum skill'],
		enum: ['beginner', 'intermediate', 'advanced'],
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true,
	},
});

// Calculate the average cost of tuition
CourseSchema.statics.calculateAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId }, // Match bootcamp with id 'bootcampId'
		},
		{
			// Group all bootcamps matched and calculate their averageCost of their tuition fields
			$group: {
				_id: '$bootcamp',
				averageCost: { $avg: '$tuition' },
			},
		},
	]);

	const averageCost = Math.ceil(obj[0].averageCost);

	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost,
		});
	} catch (error) {
		console.error(error);
	}
};

// Call averageCost method after save
CourseSchema.post('save', async function () {
	await this.constructor.calculateAverageCost(this.bootcamp);
});

// Call averageCost method before remove
CourseSchema.post('remove', async function () {
	await this.constructor.calculateAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
