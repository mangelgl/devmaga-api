const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');

// Load env vars
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const config = require('./config/index');

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to database
// 		- DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false`
mongoose.set('strictQuery', true);
mongoose.connect(config.DB.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		await Review.create(reviews);
		console.log('Seeders imported...'.green.inverse);
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log('Seeders destoyed...'.red.inverse);
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

if (process.argv[2] === '-i' || process.argv[2] === '--import') {
	importData();
}

if (process.argv[2] === '-d' || process.argv[2] === '--delete') {
	deleteData();
}
