const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/errorHandler');
const connectDatabase = require('./config/db');

// * Load environment variables
// Must be called before any routing load for Mapquest (geocoder) package to work
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

// * Connect to database
connectDatabase();

// * Load route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');

const app = express();

// * Middlewares
if (NODE_ENV === 'development') {
	app.use(morgan('dev')); // Log access requests to the API
}

app.use(express.json()); // to parse the request body to JSON type
app.use(fileupload()); // to upload files
app.use(express.static(path.join(__dirname, 'public'))); // to set public folder
app.use(cookieParser()); // to parse cookies

// * Mount routes
app.use('/api/v1/bootcamps', bootcamps); // Link the '/api/v1/bootcamps' URL with the 'routes/bootcamps.js' routes file
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);

app.use(errorHandler); // to handle errors and error messages

// *** Start the server
const server = app.listen(
	PORT,
	console.log(`Server running on ${NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandle promise rejections
process.on('unHandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red.bold);
	// Close server & exit process
	server.close(() => {
		process.exit(1);
	});
});
