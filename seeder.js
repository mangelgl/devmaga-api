const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const config = require('./config/index');

// Load env vars
dotenv.config({ path: './.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');

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

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
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
