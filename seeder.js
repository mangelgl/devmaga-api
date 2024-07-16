const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './.env' });

// Load model
const Bootcamp = require('./models/Bootcamp');

// Connect to database

// DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false`
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI);

// Read JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log('Bootcamps seeders imported...'.green.inverse);
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		console.log('Bootcamps seeders destoyed...'.green.inverse);
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
